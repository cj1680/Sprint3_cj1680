from flask import Blueprint, jsonify

bp = Blueprint("algebra", __name__, url_prefix="/algebra")

@bp.route("/")
def algebra():
    return jsonify("Success")