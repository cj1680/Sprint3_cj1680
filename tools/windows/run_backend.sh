SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../../backend" || exit
source env/Scripts/activate
pip install -r requirements.txt
python run.py
