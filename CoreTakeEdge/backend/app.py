from flask import Flask, request, jsonify
from flask_cors import CORS
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

app = Flask(__name__)
CORS(app)

def summarize_text(text, sentences_count=5):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentences_count)
    return " ".join(str(sentence) for sentence in summary)

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.json
        text = data.get("text", "")

        if not text.strip():
            return jsonify({"summary": "No text provided for summarization."}), 400

        # limit very long text to avoid overloading
        if len(text) > 20000:
            text = text[:20000]

        summary = summarize_text(text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Production-friendly host binding
    app.run(host="0.0.0.0", port=5000, debug=False)
