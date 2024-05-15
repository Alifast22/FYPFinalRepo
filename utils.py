def parse_phishy_extracted_features(extracted_features):
    phishy_features=[]
    for feature in extracted_features:
        for key,value in feature.items():
            if value == -1:
                phishy_features.append(key)
    
    return phishy_features