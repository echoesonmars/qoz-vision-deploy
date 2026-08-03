import cv2
import os
from deepface import DeepFace

class FaceRecognizer:
    def __init__(self, db_path="data/faces_db"):
        """
        Initialize DeepFace for face recognition.
        db_path: Directory containing images of known individuals (students/wanted).
                 DeepFace will use this to build embeddings representations.
        """
        self.db_path = db_path
        self.model_name = "Facenet" # Fast and accurate
        self.detector_backend = "retinaface" # Good for crowds/small faces
        
        # Ensure db path exists
        os.makedirs(self.db_path, exist_ok=True)

    def verify_faces(self, frame):
        """
        Detect faces in the frame and compare them against the database.
        Note: DeepFace.find writes representations to a pkl file in db_path for caching.
        """
        try:
            # find() returns a list of pandas DataFrames (one per face detected)
            results = DeepFace.find(
                img_path=frame, 
                db_path=self.db_path, 
                model_name=self.model_name, 
                detector_backend=self.detector_backend,
                enforce_detection=False, # Don't throw error if no face is found
                silent=True
            )
            
            recognized_individuals = []
            
            # results is a list of dataframes
            for res in results:
                if not res.empty:
                    # Found a match
                    best_match = res.iloc[0]
                    identity_path = best_match['identity']
                    
                    # Extract the name from the path (e.g., data/faces_db/john_doe.jpg)
                    name = os.path.basename(identity_path).split('.')[0]
                    
                    # You can extract coordinates if needed from the results object depending on version
                    recognized_individuals.append({
                        "name": name,
                        "distance": float(best_match.get('distance', 0))
                    })
                    
            return recognized_individuals
            
        except Exception as e:
            # print(f"Face recognition error: {e}")
            return []
