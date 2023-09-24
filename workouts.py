import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import tempfile
import streamlit as st


#demo video 
# DEMO_VIDEO = 'ri1.mp4'



#mediapipe inbuilt solutions 
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utilspip install opencv-python
st.set_page_config(layout="wide")


def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle


def main():

    #title 
    st.title('Workout Wizard')

    #sidebar title
    st.sidebar.title('Choose your exercise')

    # st.sidebar.subheader('Parameters')
    #creating a button for webcam
    use_webcam = st.sidebar.button('Use Webcam')
    #creating a slider for detection confidence 
    # detection_confidence = st.sidebar.slider('Min Detection Confidence', min_value =0.0,max_value = 1.0,value = 0.5)
    
    #model selection 
    model_selection = st.sidebar.selectbox('Model Selection',options=['Bicep Curls','Squats','Plank'])

    st.markdown(' ## Output')
    stframe = st.empty()
    
    #file uploader
    # video_file_buffer = st.sidebar.file_uploader("Upload a video", type=[ "mp4", "mov",'avi','asf', 'm4v' ])

    
    #temporary file name 
    # tfflie = tempfile.NamedTemporaryFile(delete=False)

    # if not video_file_buffer:

    #     if use_webcam:
    #         vid = cv2.VideoCapture(0)
    #     else:
    #         vid = cv2.VideoCapture(0)
            # vid = cv2.VideoCapture(DEMO_VIDEO)
            # tfflie.name = DEMO_VIDEO
    
    # else:
    #     tfflie.write(video_file_buffer.read())
    #     vid = cv2.VideoCapture(tfflie.name)

    #values 
    # width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
    # height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
    # fps = int(vid.get(cv2.CAP_PROP_FPS))
    #codec = cv2.VideoWriter_fourcc(*FLAGS.output_format)
    # codec = cv2.VideoWriter_fourcc('V','P','0','9')
    # out = cv2.VideoWriter('output1.webm', codec, fps, (width, height))


    # st.sidebar.text('Input Video')
    # st.sidebar.video(tfflie.name)
    

    # original = Image.open(image)



    # drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    col1, col2 = st.columns(2)

    vid = cv2.VideoCapture(0)
    instructor = cv2.VideoCapture('urmom.mp4')

    if instructor.isOpened():
        ret2, image2 = instructor.read()
        
        if ret2:
            with col2:
                st.video('urmom.mp4')
    
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose1, \
        mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose2:
        
        while vid.isOpened() and instructor.isOpened():
            
            ret, image = vid.read()
            resized_frame = cv2.resize(image, (600,800))
                   
            # ret2, image2 = instructor.read()

  
            if not ret:
                break
            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            # image2 = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)

            results = pose1.process(image) #previously image_rgb
            results2 = pose2.process(image2)

            if results.pose_landmarks:
                landmarks1 = results.pose_landmarks.landmark
                shoulder1 = [int(landmarks1[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * image.shape[1]),
                         int(landmarks1[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * image.shape[0])]
                elbow1 = [int(landmarks1[mp_pose.PoseLandmark.LEFT_ELBOW.value].x * image.shape[1]),
                        int(landmarks1[mp_pose.PoseLandmark.LEFT_ELBOW.value].y * image.shape[0])]
                wrist1 = [int(landmarks1[mp_pose.PoseLandmark.LEFT_WRIST.value].x * image.shape[1]),
                      int(landmarks1[mp_pose.PoseLandmark.LEFT_WRIST.value].y * image.shape[0])]

                angle1 = calculate_angle(shoulder1, elbow1, wrist1)
                cv2.putText(image, f'Angle: {round(angle1, 2)}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.circle(image, tuple(shoulder1), 15, (255, 255, 255), -1)
                cv2.circle(image, tuple(elbow1), 15, (255, 255, 255), -1)
                cv2.circle(image, tuple(wrist1), 15, (255, 255, 255), -1)

                if 32 <= abs(angle1) <= 175:
                    cv2.putText(image, 'YES', (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)
                else:
                    cv2.putText(image, 'INCORRECT FORM', (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 2)
            
            with col1:
                
                stframe.image(image,use_column_width=True)

            # if results2.pose_landmarks:
            #video1 = stframe.image(image,use_column_width=True)
            #video2 = stframe.image(image2,use_column_width=True)

            #webcam = stframe.image(image)

            
        
        
        
    
        

        vid.release()
        # instructor.release()
        # out.release()
        cv2.destroyAllWindows()

if __name__ == '__main__':
    main()


    # with mp_face_detection.FaceDetection(
    # model_selection=model_selection, min_detection_confidence=detection_confidence) as face_detection:
        
    #     while vid.isOpened():

    #         ret, image = vid.read()

    #         if not ret:
    #             break
    #         image.flags.writeable = False
    #         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    #         results = face_detection.process(image)

    #         if results.detections:
    #             for detection in results.detections:
    #                 mp_drawing.draw_detection(image, detection)
    #         stframe.image(image,use_column_width=True)

    #     vid.release()
    #     out.release()
    #     cv2.destroyAllWindows()

    # st.success('Video is Processed')
    # st.stop()
