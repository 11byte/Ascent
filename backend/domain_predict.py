import torch
import torch.nn as nn
import torch.nn.functional as F
import sys, json, numpy as np
from sklearn.preprocessing import StandardScaler

torch.serialization.add_safe_globals([StandardScaler])

# ---------------- Model Definition ----------------
model = nn.Sequential(
    nn.Linear(7, 128),
    nn.BatchNorm1d(128),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(128, 64),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(64, 5)
)

# ---------------- Load Checkpoint ----------------
checkpoint = torch.load(
    "models/domain_predictor_v2.pth",
    map_location=torch.device("cpu"),
    weights_only=False
)

# Some checkpoints prefix keys with "model." — remove that prefix
state_dict = checkpoint.get("model_state", checkpoint)
new_state_dict = {}
for k, v in state_dict.items():
    new_k = k.replace("model.", "")  # strip "model." prefix
    new_state_dict[new_k] = v

model.load_state_dict(new_state_dict)
model.eval()

scaler = checkpoint.get("scaler", None)
label_classes = checkpoint.get("label_encoder_classes", ["AI", "AppDev", "Cyber", "Design", "Web"])

# ---------------- Input & Preprocess ----------------
raw_input = sys.stdin.read()
data = json.loads(raw_input)
features = np.array([list(data.values())], dtype=np.float32)

if scaler:
    features = scaler.transform(features)
else:
    features = (features - np.mean(features)) / (np.std(features) + 1e-8)

x = torch.tensor(features)

# ---------------- Inference ----------------
with torch.no_grad():
    outputs = model(x)
    probs = F.softmax(outputs, dim=1)
    pred_idx = torch.argmax(probs, dim=1).item()
    confidence = probs[0, pred_idx].item()

# ---------------- Output ----------------
print(json.dumps({
    "predicted_domain": label_classes[pred_idx],
    "confidence": round(confidence, 4)
}))
