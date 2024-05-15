from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sklearn.impute import SimpleImputer
from flask_cors import CORS
from Model import extract_phishing_features
from utils import parse_phishy_extracted_features

# Load the trained model and other relevant objects
stacked_model_1 = joblib.load('stacked_model_1.pkl')
stacked_model_2 = joblib.load('stacked_model_2.pkl')
stacked_model_3 = joblib.load('stacked_model_3.pkl')
# scaler = joblib.load('scaler.pkl')
# k_best_features = joblib.load('k_best_features.pkl')

app = Flask(__name__)
CORS(app)

def preprocess_features(features):
    # Handle missing values using SimpleImputer
    imputer = SimpleImputer(strategy='mean')
    features_imputed = imputer.fit_transform(features)
    return features_imputed

def predict_result(features):
    # Preprocess the features to handle missing values
    
    features_processed = preprocess_features(pd.DataFrame(features))
    
    # Predict using each model
    prediction_1 = stacked_model_1.predict(features_processed)
    prediction_2 = stacked_model_2.predict(features_processed)
    prediction_3 = stacked_model_3.predict(features_processed)
    print("_________________________")
    print(prediction_1)
    print("_________________________")
    print(prediction_2)
    print("_________________________")
    print(prediction_3)
    print("_______________________")
    # Aggregate predictions by majority vote
    final_prediction = max(set([prediction_1[0],prediction_2[0]]), key=[prediction_1[0],prediction_2[0]].count)
    return final_prediction

@app.route('/check_phishing', methods=['POST'])
def check_phishing():
    try:
        # Get the URL from the request payload
        url = request.json.get('url')
        mode = request.json.get('mode')
        extracted_features=extract_phishing_features(url)
        print(extracted_features)
        result_predictions = predict_result(extracted_features)
        print("++++++++++++++++++++++++++++++Results")
        # print(result_predictions)
        phishing_result = True if result_predictions == 0 else False if result_predictions == 1 else "maybe"
        if not mode:
            # print(extracted_features)
            all_phishy_features = parse_phishy_extracted_features(extracted_features)
            print(all_phishy_features)
            return jsonify({'url': url, 'phishing':phishing_result, 'phishy_features':all_phishy_features})
        else:
            return jsonify({'url': url, 'phishing':phishing_result, 'phishy_features': [] })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

