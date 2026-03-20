from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
    Settings
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq as GroqLLM
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)


def load_rag():
    # ✅ SET BOTH BEFORE ANYTHING
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en"
    )

    Settings.llm = GroqLLM(
        model="llama-3.1-8b-instant",
        api_key=os.getenv("GROQ_API_KEY")
    )

    # ✅ Now load or create
    if os.path.exists("storage"):
        print("✅ Loading existing index...")
        storage_context = StorageContext.from_defaults(persist_dir="storage")
        index = load_index_from_storage(storage_context)
    else:
        print("⚡ Creating new index...")
        documents = SimpleDirectoryReader("docs").load_data()
        index = VectorStoreIndex.from_documents(documents)

        index.storage_context.persist(persist_dir="storage")

    return index.as_query_engine()