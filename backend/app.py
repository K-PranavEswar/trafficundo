from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

from kerala_data import KERALA_DISTRICTS, SEED_REPORTS
from models import ChatMessage, TrafficReport, db
from routes import api_bp


socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")


def seed_database():
    if not TrafficReport.query.first():
        db.session.add_all(
            TrafficReport(**report)
            for report in SEED_REPORTS
        )

    if not ChatMessage.query.first():
        db.session.add_all(
            [
                ChatMessage(
                    district="Ernakulam",
                    username="User_7128",
                    message="Avoid Vyttila for the next hour. Movement is slow.",
                ),
                ChatMessage(
                    district="Kozhikode",
                    username="User_3810",
                    message="Beach Road is passable only for two-wheelers near the flooded stretch.",
                ),
            ]
        )

    db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "trafficundo-dev-secret"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///trafficundo.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    socketio.init_app(app)
    app.extensions["socketio"] = socketio
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()
        seed_database()

    @app.get("/")
    def home():
        return {
            "message": "TrafficUndo API Running",
            "districts": KERALA_DISTRICTS,
            "realtime": "Socket.IO enabled",
        }

    return app


@socketio.on("join_district")
def handle_join_district(data):
    district = (data or {}).get("district")
    username = (data or {}).get("username", "Anonymous")
    if district in KERALA_DISTRICTS:
        join_room(district)
        emit(
            "receive_message",
            {
                "district": district,
                "username": "TrafficUndo",
                "message": f"{username} joined {district} live chat.",
            },
            room=district,
        )


@socketio.on("leave_district")
def handle_leave_district(data):
    district = (data or {}).get("district")
    if district in KERALA_DISTRICTS:
        leave_room(district)


@socketio.on("send_message")
def handle_send_message(data):
    data = data or {}
    district = data.get("district")
    username = str(data.get("username") or "Anonymous")[:40]
    message_text = str(data.get("message") or "").strip()[:600]

    if district not in KERALA_DISTRICTS or not message_text:
        return

    message = ChatMessage(district=district, username=username, message=message_text)
    db.session.add(message)
    db.session.commit()
    emit("receive_message", message.to_dict(), room=district)


app = create_app()


if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
