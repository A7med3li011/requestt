import { useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import "./RecordAudio.scss";

const RecordAudio = ({ setIsRecording, onAddAudioMessage }) => {
  const { startRecording, stopRecording, isRecording, recordingBlob } =
    useAudioRecorder();

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    onAddAudioMessage(url, blob);
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this environment.");
      return;
    }

    setIsRecording(isRecording);

    try {
      if (isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    } catch (error) {
      console.error("Error with audio recording: ", error);
    }
  }, [isRecording]);

  return (
    <div className="RecordAudio">
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        classes={{ icon: "mic-icon" }}
        buttonProps={{ icon: <MdOutlineKeyboardVoice /> }}
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer
        onError={(error) => {
          console.error("Audio Recorder Error: ", error);
        }}
      />
    </div>
  );
};

export default RecordAudio;
