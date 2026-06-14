from collections import Counter
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import IntegrityError

from kerala_data import KERALA_DISTRICTS, REASON_TYPES, lookup_pincode
from models import ChatMessage, ReportVote, TrafficReport, db


api_bp = Blueprint("api", __name__, url_prefix="/api")


def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code


def payload():
    return request.get_json(silent=True) or {}


def emit_event(event, data, room=None):
    socketio = current_app.extensions.get("socketio")
    if socketio:
        socketio.emit(event, data, room=room)


def require_fields(data, fields):
    missing = [field for field in fields if data.get(field) in (None, "")]
    if missing:
        raise ValueError(f"Missing required field(s): {', '.join(missing)}")


def normalize_district(value):
    district = str(value or "").strip()
    if district not in KERALA_DISTRICTS:
        raise ValueError("Invalid Kerala district.")
    return district


def build_report(data, report=None):
    require_fields(
        data,
        ["district", "from_lat", "from_lng", "to_lat", "to_lng", "description", "reason"],
    )
    district = normalize_district(data["district"])
    reason = str(data["reason"]).strip()
    if reason not in REASON_TYPES:
        raise ValueError("Invalid report reason.")

    target = report or TrafficReport(user_id=data.get("user_id") or f"User_{uuid4().hex[:4].upper()}")
    target.district = district
    target.from_lat = float(data["from_lat"])
    target.from_lng = float(data["from_lng"])
    target.to_lat = float(data["to_lat"])
    target.to_lng = float(data["to_lng"])
    target.from_label = str(data.get("from_label") or "Point A").strip()
    target.to_label = str(data.get("to_label") or "Point B").strip()
    target.description = str(data["description"]).strip()
    target.reason = reason
    target.road_name = str(data.get("road_name") or "").strip() or None
    target.status = str(data.get("status") or target.status or "Active").strip().title()
    if target.status not in {"Active", "Resolved", "Rejected"}:
        raise ValueError("Invalid report status.")
    return target


@api_bp.get("/meta")
def meta():
    return jsonify({"districts": KERALA_DISTRICTS, "reasons": REASON_TYPES})


@api_bp.post("/location/pincode")
def location_by_pincode():
    data = payload()
    location = lookup_pincode(data.get("pincode"))
    if not location:
        return error_response("Enter a valid Kerala pincode.", 422)
    return jsonify(location)


@api_bp.get("/reports")
def get_reports():
    district = request.args.get("district")
    status = request.args.get("status")
    search = request.args.get("search")

    query = TrafficReport.query
    if district:
        query = query.filter(TrafficReport.district == district)
    if status:
        query = query.filter(TrafficReport.status == status)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (TrafficReport.road_name.ilike(like))
            | (TrafficReport.description.ilike(like))
            | (TrafficReport.from_label.ilike(like))
            | (TrafficReport.to_label.ilike(like))
        )

    reports = query.order_by(TrafficReport.created_at.desc()).all()
    return jsonify([report.to_dict() for report in reports])


@api_bp.post("/reports")
def create_report():
    try:
        report = build_report(payload())
        db.session.add(report)
        db.session.commit()
    except ValueError as exc:
        return error_response(str(exc))

    data = report.to_dict()
    emit_event("new_report", data)
    return jsonify(data), 201


@api_bp.put("/reports/<int:report_id>")
def update_report(report_id):
    report = TrafficReport.query.get_or_404(report_id)
    try:
        report = build_report(payload(), report)
        db.session.commit()
    except ValueError as exc:
        return error_response(str(exc))

    data = report.to_dict()
    emit_event("report_updated", data)
    return jsonify(data)


@api_bp.delete("/reports/<int:report_id>")
def delete_report(report_id):
    report = TrafficReport.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    emit_event("report_updated", {"id": report_id, "deleted": True})
    return jsonify({"message": "Report deleted"})


@api_bp.post("/reports/<int:report_id>/vote")
def vote_report(report_id):
    report = TrafficReport.query.get_or_404(report_id)
    data = payload()
    vote_type = str(data.get("vote_type") or "").strip().lower()
    user_id = str(data.get("user_id") or "").strip()
    if vote_type not in {"verify", "reject"}:
        return error_response("vote_type must be verify or reject.")
    if not user_id:
        return error_response("user_id is required.")

    vote = ReportVote.query.filter_by(report_id=report.id, user_id=user_id).first()
    if vote:
        vote.vote_type = vote_type
    else:
        db.session.add(ReportVote(report_id=report.id, user_id=user_id, vote_type=vote_type))
    db.session.commit()

    counts = Counter(v.vote_type for v in ReportVote.query.filter_by(report_id=report.id).all())
    report.verify_votes = counts.get("verify", 0)
    report.reject_votes = counts.get("reject", 0)
    db.session.commit()

    data = report.to_dict()
    emit_event("report_updated", data)
    return jsonify(data)


@api_bp.get("/chat/<district>")
def get_chat(district):
    try:
        district = normalize_district(district)
    except ValueError as exc:
        return error_response(str(exc), 404)

    messages = (
        ChatMessage.query.filter_by(district=district)
        .order_by(ChatMessage.created_at.desc())
        .limit(60)
        .all()
    )
    return jsonify([message.to_dict() for message in reversed(messages)])


@api_bp.post("/chat")
def post_chat():
    data = payload()
    try:
        require_fields(data, ["district", "username", "message"])
        district = normalize_district(data["district"])
        message = ChatMessage(
            district=district,
            username=str(data["username"]).strip()[:40],
            message=str(data["message"]).strip()[:600],
        )
        db.session.add(message)
        db.session.commit()
    except ValueError as exc:
        return error_response(str(exc))

    body = message.to_dict()
    emit_event("receive_message", body, room=district)
    return jsonify(body), 201



@api_bp.get("/analytics")
def analytics():
    reports = TrafficReport.query.order_by(
    TrafficReport.created_at.desc()
).all()
    district_counts = Counter(report.district for report in reports)
    reason_counts = Counter(report.reason for report in reports)
    route_counts = Counter(
        f"{report.from_label or 'Point A'} to {report.to_label or 'Point B'}" for report in reports
    )
    recent_activity = [
        {
            "type": "report",
            "label": f"{report.reason} in {report.district}",
            "created_at": report.created_at.isoformat(),
        }
        for report in reports[:8]
    ]

    return jsonify(
    {
        "total_reports": len(reports),
        "active_blocks": sum(
            1 for report in reports
            if report.status == "Active"
        ),
        "resolved_reports": sum(
            1 for report in reports
            if report.status == "Resolved"
        ),
        "community_helpers": len(
            {report.user_id for report in reports}
        ),
        "district_reports": dict(district_counts),
        "reason_counts": dict(reason_counts),
        "most_blocked_routes": [
            {
                "route": route,
                "count": count
            }
            for route, count in route_counts.most_common(8)
        ],
        "recent_activity": recent_activity,
    }
)

@api_bp.get("/dashboard")
def dashboard():
    reports = TrafficReport.query.order_by(TrafficReport.created_at.desc()).all()
    messages = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(5).all()

    return jsonify(
    {
        "total_reports": len(reports),
        "active_blocks": sum(
            1 for report in reports
            if report.status == "Active"
        ),
        "resolved_reports": sum(
            1 for report in reports
            if report.status == "Resolved"
        ),
        "community_helpers": len(
            {report.user_id for report in reports}
        ),
        "recent_reports":
        [report.to_dict() for report in reports[:6]],

        "latest_messages":
        [message.to_dict() for message in messages],

        "districts":
        KERALA_DISTRICTS,
    }
)
