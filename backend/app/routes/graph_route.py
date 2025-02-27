from flask import Blueprint, jsonify

bp = Blueprint("graph", __name__, url_prefix="/graph")

@bp.route("/")
def graph():
    return jsonify("Success")