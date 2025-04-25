#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

start bash "$SCRIPT_DIR/run_backend.sh"
start bash "$SCRIPT_DIR/run_frontend.sh"
