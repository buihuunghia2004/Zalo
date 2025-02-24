from datasets import load_dataset

dataset = load_dataset("daily_dialog",trust_remote_code=True, keep_in_memory=True)
print(dataset["train"][0])  # In ra hội thoại đầu tiên

