import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
import joblib

# Load datasets
df1 = pd.read_csv('Rami-new.csv')  # Replace with your dataset
df2 = pd.read_csv('Kaggle-akash.csv')  # Replace with your dataset
df3 = pd.read_csv('V.SHAHRIVARI.csv')  # Replace with your dataset

# Preprocess data
def preprocess_data(df):
    X = df.drop('Result', axis=1)
    y = df['Result']
    # Impute missing values
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, y_train, y_test

X_train_scaled_1, X_test_scaled_1, y_train_1, y_test_1 = preprocess_data(df1)
X_train_scaled_2, X_test_scaled_2, y_train_2, y_test_2 = preprocess_data(df2)
X_train_scaled_3, X_test_scaled_3, y_train_3, y_test_3 = preprocess_data(df3)

# Base learners
svm_model = SVC(kernel='poly', degree=2, probability=True)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
gb_model = GradientBoostingClassifier(n_estimators=100, random_state=42)

# Stacking ensemble for each dataset
stacked_model_1 = StackingClassifier(
    estimators=[
        ('svm', svm_model),
        ('rf', rf_model),
        ('gb', gb_model)
    ],
    final_estimator=LogisticRegression(),
    cv=5
)

stacked_model_2 = StackingClassifier(
    estimators=[
        ('svm', svm_model),
        ('rf', rf_model),
        ('gb', gb_model)
    ],
    final_estimator=LogisticRegression(),
    cv=5
)

stacked_model_3 = StackingClassifier(
    estimators=[
        ('svm', svm_model),
        ('rf', rf_model),
        ('gb', gb_model)
    ],
    final_estimator=LogisticRegression(),
    cv=5
)

# Fit stacking model on all datasets combined
stacked_model_1.fit(X_train_scaled_1, y_train_1)
stacked_model_2.fit(X_train_scaled_2, y_train_2)
stacked_model_3.fit(X_train_scaled_3, y_train_3)

# Save fitted models
joblib.dump(stacked_model_1, 'stacked_model_1.pkl')
joblib.dump(stacked_model_2, 'stacked_model_2.pkl')
joblib.dump(stacked_model_3, 'stacked_model_3.pkl')
