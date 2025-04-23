from flask import Flask
from app.routes import graph_route, geometry_route, algebra_route, wordproblem_route, login, register, login_token, history_route, deleteConvo_route

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(graph_route.bp)
    app.register_blueprint(geometry_route.bp)
    app.register_blueprint(algebra_route.bp)
    app.register_blueprint(wordproblem_route.bp)
    app.register_blueprint(login.bp)
    app.register_blueprint(register.bp)
    app.register_blueprint(login_token.bp)
    app.register_blueprint(history_route.bp)
    app.register_blueprint(deleteConvo_route.bp)
    return app