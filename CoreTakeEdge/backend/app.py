from flask import Flask, request, jsonify
from flask_cors import CORS  # For CORS fix
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

app = Flask(__name__)
CORS(app)  # allow requests from anywhere

def summarize_text(text, sentences_count=5):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentences_count)
    return " ".join(str(sentence) for sentence in summary)

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")
    summary = summarize_text(text)
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
