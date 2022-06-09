import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as React from "react";
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wave from "../../assets/wave.png";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Slider } from "@miblanchard/react-native-slider";
import Button from "../components/Button";
import buttonData from "../mapping/buttonData";

const soundtracksdir = FileSystem.cacheDirectory + "soundtracks/";
const SoundTrackFileUri = (SoundTrackId) =>
  soundtracksdir + `track_${SoundTrackId}.mp3`;

const audio = [
  {
    filename: "My Awesome Audio",
    id: "drop",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    filename: "My Not so Awesome Audio",
    id: "rainbow",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    filename: "Not Awesome at all audio",
    id: "cloud",
    uri: "ihttps://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    filename: "Dont know anymore Audio",
    id: "thunder",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(soundtracksdir);
  if (!dirInfo.exists) {
    console.log("Sound Track directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(soundtracksdir, {
      intermediates: true,
    });
  }
}

export async function getSingleSoundTrack(audio) {
  await ensureDirExists();

  const fileUri = SoundTrackFileUri(audio.id);
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  console.log("FILE INFO ", fileInfo);

  if (!fileInfo.exists) {
    console.log("SoundTrack isn't cached locally. Downloading...");
    await FileSystem.downloadAsync(audio.uri, fileUri);
  }

  return fileUri;
}

const Home = () => {
  //Sound Downloading Function Starts
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackObject, setPlaybackObject] = React.useState<number | null>(
    null
  );
  const [playbackStatus, setPlaybackStatus] = React.useState<boolean | null>(
    null
  );

  const [value, setValue] = React.useState(1);

  function change(value) {
    setValue(value);
    if (value < 0.1 && value > 0) {
      changeVolume(0);
    } else if (0.1 <= value && value < 0.2) {
      changeVolume(0.2);
    } else if (0.2 <= value && value < 0.4) {
      changeVolume(0.4);
    } else if (0.4 <= value && value < 0.6) {
      changeVolume(0.6);
    } else if (0.6 <= value && value < 0.8) {
      changeVolume(0.8);
    } else if (0.8 <= value && value <= 1) {
      changeVolume(1);
    }
  }

  async function changeVolume(value) {
    // console.log('changing value to ', value)
    await playbackObject.setVolumeAsync(value);
  }

  React.useEffect(() => {
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
    }
  }, []);

  const handleAudioPlayPause = async (audio) => {
    // initial loading
    if (playbackObject !== null && playbackStatus === null) {
      const FileURI = await getSingleSoundTrack(audio);
      const status = await playbackObject.loadAsync(
        { uri: FileURI },
        { shouldPlay: true }
      );
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }

    // It will pause our audio
    if (playbackStatus.isPlaying) {
      const status = await playbackObject.pauseAsync();
      setIsPlaying(false);
      return setPlaybackStatus(status);
    }

    // It will resume our audio
    if (!playbackStatus.isPlaying) {
      const status = await playbackObject.playAsync();
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }
  };
  return (
    <SafeAreaView style={styles.containers}>
      <View style={styles.top}>
        <TouchableOpacity>
          <AntDesign name="closesquareo" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontFamily: "Reg" }}>
          Instruction
        </Text>
      </View>
      <View style={styles.mid}>
        <Image source={wave} style={{ width: "100%", alignSelf: "center" }} />
      </View>
      <View style={styles.bCon}>
        <View style={styles.bottom}>
          {buttonData.map((e) => {
            return (
              <Button
                onPress={() => handleAudioPlayPause(audio[e.num.toString()])}
                name={e.name}
                key={e.num.toString()}
              />
            );
          })}
        </View>
        <View style={styles.sCon}>
          <Slider
            value={value}
            onValueChange={(value) => change(value)}
            thumbTintColor="#44A1C7"
            minimumTrackTintColor="#44A1C7"
            maximumTrackTintColor="#d3d3d3"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  mid: {
    alignSelf: "stretch",
  },
  bottom: {
    display: "flex",
    // paddingBottom: 100,
    // flexWrap: 'wrap',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
    marginHorizontal: 10,
  },
  bCon: {
    paddingVertical: 40,
  },
  sCon: {
    paddingHorizontal: 29,
    marginVertical: 10,
  },
  icons: {
    borderWidth: 3,
    borderColor: "rgb(170, 207, 202)",
    borderRadius: 40,
    padding: 10,
    textAlign: "center",
  },
});

export default Home;