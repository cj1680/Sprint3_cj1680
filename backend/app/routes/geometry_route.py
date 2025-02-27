from flask import Blueprint, jsonify

bp = Blueprint("geometry", __name__, url_prefix="/geometry")

@bp.route("/")
def geometry():
    return jsonify("Success")
