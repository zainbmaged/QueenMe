

import glob
import json
import os

def load_data(data_dir:str) ->list[dict]:
    """Load data from JSONL files in the specified directory."""
    data =[]
    for file in glob.glob(os.path.join(data_dir, "*.jsonl")):
        with open(file, "r", encoding="utf-8") as f:
            for i, line in enumerate(f, start=1):
                try:
                 record = json.loads(line)
                except json.JSONDecodeError as e:
                    print(f"\n {file} JSON ERROR FOUND")
                    print(f"File line number: {i}")
                    print(f"Error message: {e}")
                    print("Broken line content:")
                    print(line)
                    raise e
                record["source_file"] = os.path.basename(file)
                data.append(record)
    print(f"Loaded {len(data)} records from {data_dir}")
    print("Sample record keys:", data[0].keys() if data else "EMPTY")
    print("Sample record:", data[0] if data else "EMPTY")
    return data


def build_embeddings(doc:dict)-> tuple[str,dict]:
    """Build a text representation and cleaned metadata for a document."""
    meta= doc.get("metadata") or doc
    parts =[]
    cleaned_meta ={}
    META_PRIORTY = [
      "program_name",
      "delivery_mode",
      "faculty",
      "degree_level",
      "degree_type",
      "title",
       
      "source"]
    
    for key in META_PRIORTY:
        if key not in meta:
            continue
        value = meta.get(key)
        if value is None:
            continue
        if isinstance(value, list):
            value= " ".join(map(str,value))
        parts.append(f"{key}:{value}")
        cleaned_meta[key] = value
    
    for key, value in meta.items():
        if key in META_PRIORTY or key == "metadata":
            continue
        if isinstance(value, list):
            value= " ".join(map(str,value))
        parts.append(f"{key}:{value}")
        cleaned_meta[key] = value

    text = meta.get("text") or doc.get("content") or doc.get("text") or doc.get("description") or ""
    parts.append(f"description: {text}")
    
    return " ".join(parts),cleaned_meta


