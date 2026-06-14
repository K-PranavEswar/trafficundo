from datetime import datetime, timezone
from uuid import uuid4

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def utc_now():
    return datetime.now(timezone.utc)


def iso_datetime(value):
    if not value:
        return None
    return value.isoformat()


class TrafficReport(db.Model):
    __tablename__ = "traffic_reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(40), nullable=False, index=True)
    district = db.Column(db.String(80), nullable=False, index=True)
    from_lat = db.Column(db.Float, nullable=False)
    from_lng = db.Column(db.Float, nullable=False)
    to_lat = db.Column(db.Float, nullable=False)
    to_lng = db.Column(db.Float, nullable=False)
    from_label = db.Column(db.String(160), nullable=True)
    to_label = db.Column(db.String(160), nullable=True)
    description = db.Column(db.Text, nullable=False)
    reason = db.Column(db.String(80), nullable=False)
    road_name = db.Column(db.String(160), nullable=True, index=True)
    status = db.Column(db.String(40), nullable=False, default="Active", index=True)
    verify_votes = db.Column(db.Integer, nullable=False, default=0)
    reject_votes = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "district": self.district,
            "from_lat": self.from_lat,
            "from_lng": self.from_lng,
            "to_lat": self.to_lat,
            "to_lng": self.to_lng,
            "from_label": self.from_label,
            "to_label": self.to_label,
            "description": self.description,
            "reason": self.reason,
            "road_name": self.road_name,
            "status": self.status,
            "verify_votes": self.verify_votes,
            "reject_votes": self.reject_votes,
            "created_at": iso_datetime(self.created_at),
            "updated_at": iso_datetime(self.updated_at),
        }


class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    id = db.Column(db.Integer, primary_key=True)
    district = db.Column(db.String(80), nullable=False, index=True)
    username = db.Column(db.String(40), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "district": self.district,
            "username": self.username,
            "message": self.message,
            "created_at": iso_datetime(self.created_at),
        }



class ReportVote(db.Model):
    __tablename__ = "report_votes"

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("traffic_reports.id"), nullable=False, index=True)
    user_id = db.Column(db.String(40), nullable=False, index=True)
    vote_type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    __table_args__ = (db.UniqueConstraint("report_id", "user_id", name="unique_report_vote"),)
