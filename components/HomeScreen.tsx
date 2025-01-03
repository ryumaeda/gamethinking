import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HandleThinkGameButton from "./HandleThinkGameButton";

interface Member {
  name: string;
  gender: string;
}

const HomeScreen = ({
  navigate,
  onThinkGame,
}: {
  navigate: (screen: string, props: any) => void;
  onThinkGame: () => void;
}) => {
  const [animation] = useState(new Animated.ValueXY({ x: 145, y: 400 }));
  const [thinkFlag, setthinkFlag] = useState(false);
  const [addFlag, setaddFlag] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberGender, setNewMemberGender] = useState("");
  const [gameRequest, setGameRequest] = useState("");

  useEffect(() => {
    animation.setValue({ x: 145, y: 400 });
  }, []);

  const moveToThinking = () => {
    onThinkGame();
    setIsMoving(true);
    Animated.timing(animation, {
      toValue: { x: 30, y: 680 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setthinkFlag(true);
      setIsMoving(false);
    });
  };

  const resetIcon = () => {
    setIsMoving(true);
    Animated.timing(animation, {
      toValue: { x: 145, y: 400 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setthinkFlag(false);
      setaddFlag(false);
      setIsMoving(false);
    });
  };

  const addMember = () => {
    setIsMoving(true);
    Animated.timing(animation, {
      toValue: { x: 30, y: 680 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setaddFlag(true);
      setIsMoving(false);
    });
  };

  const setMember = () => {
    setMembers([...members, { name: newMemberName, gender: newMemberGender }]);
    setNewMemberName("");
    setNewMemberGender("");
    setaddFlag(false);
    Animated.timing(animation, {
      toValue: { x: 145, y: 400 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setthinkFlag(false);
      setIsMoving(false);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Icon (絶対座標で表示)*/}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: animation.getTranslateTransform() },
          ]}
        >
          <MaterialCommunityIcons
            name="emoticon-happy"
            size={100}
            color="gray"
          />
        </Animated.View>

        {/* 初期画面*/}
        {!thinkFlag && !addFlag && (
          <View className="ml-4 mt-10 flex flex-wrap flex-row h-1/4">
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                className={`p-2 mb-1 w-[30%] ${
                  index % 3 === 2 ? "" : "mr-[3.33%]"
                } items-center ${
                  member.gender === "男性" ? "bg-blue-500" : "bg-pink-500"
                }`}
                onPress={() => {
                  setMembers(members.filter((_, i) => i !== index));
                }}
              >
                <Text className="text-white font-bold ">{member.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {!thinkFlag && !addFlag && !isMoving && (
          <View className="flex-1 justify-center items-center mt-40">
            <>
              <TouchableOpacity
                className="bg-gray-800 rounded-lg p-2 m-2"
                onPress={addMember}
              >
                <Text className="text-white font-bold">飲みメンバー追加</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-800 rounded-lg p-2 m-2"
                onPress={moveToThinking}
              >
                <Text className="text-white font-bold">ゲームを考えて</Text>
              </TouchableOpacity>
            </>
          </View>
        )}

        {/* think画面(ゲームを考案させる) */}
        {thinkFlag && (
          <View className="ml-4 mt-10 flex flex-wrap flex-row h-1/4">
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                className={`p-2 mb-1 w-[30%] ${
                  index % 3 === 2 ? "" : "mr-[3.33%]"
                } items-center ${
                  member.gender === "男性" ? "bg-blue-500" : "bg-pink-500"
                }`}
                onPress={() => {
                  setMembers(members.filter((_, i) => i !== index));
                }}
              >
                <Text className="text-white font-bold ">{member.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {thinkFlag && !isMoving && (
          <View>
            <View>
              <Text className="ml-10 text-xl font-bold">
                ゲームの要望はあるかい？
              </Text>
              <TextInput
                className="mt-5 h-24 border border-gray-448 p-2 mx-4 bg-white shadow-lg rounded-lg"
                placeholder={`例：「トランプを使って！」\n要望が無ければ空白でOK!`}
                placeholderTextColor="#ccc"
                multiline={true}
                textBreakStrategy="highQuality"
                onBlur={Keyboard.dismiss}
                maxLength={50}
                value={gameRequest}
                onChangeText={setGameRequest}
              />
            </View>
            <View
              style={{
                position: "absolute",
                top: 448,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                className="bg-gray-800 rounded-lg p-2 m-2"
                onPress={resetIcon}
              >
                <Text className="text-white font-bold text-center">戻る</Text>
              </TouchableOpacity>
            </View>
            <View className="items-center mt-5">
              <HandleThinkGameButton
                navigate={navigate}
                members={members}
                gameRequest={gameRequest}
                buttonText="ゲームを考えて！"
                onThinkGame={onThinkGame}
              />
            </View>
          </View>
        )}

        {/* add画面(メンバーを追加する) */}
        {addFlag && (
          <View className="ml-4 mt-10 flex flex-wrap flex-row h-1/4">
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                className={`p-2 mb-1 w-[30%] ${
                  index % 3 === 2 ? "" : "mr-[3.33%]"
                } items-center ${
                  member.gender === "男性" ? "bg-blue-500" : "bg-pink-500"
                }`}
                onPress={() => {
                  setMembers(members.filter((_, i) => i !== index));
                }}
              >
                <Text className="text-white font-bold ">{member.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {addFlag && !isMoving && (
          <View>
            <View>
              <Text className="ml-10 text-xl font-bold">
                メンバーの名前と性別はなんだい？
              </Text>
              <View className="mt-5">
                <TextInput
                  className="h-10 border border-gray-448 mx-4 my-2 p-2 bg-white shadow-lg rounded-lg"
                  placeholder="名前"
                  placeholderTextColor="#999"
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                />
              </View>
              <View className="flex-row mx-4 my-2 justify-between">
                <TouchableOpacity
                  className={`flex-1 h-10 justify-center items-center mx-1 ${
                    newMemberGender === "男性" ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  onPress={() => setNewMemberGender("男性")}
                >
                  <Text
                    className={`${
                      newMemberGender === "男性" ? "text-white" : "text-black"
                    }`}
                  >
                    男性
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 h-10 justify-center items-center mx-1 ${
                    newMemberGender === "女性" ? "bg-pink-500" : "bg-gray-200"
                  }`}
                  onPress={() => setNewMemberGender("女性")}
                >
                  <Text
                    className={`${
                      newMemberGender === "女性" ? "text-white" : "text-black"
                    }`}
                  >
                    女性
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 h-10 justify-center items-center mx-1 ${
                    newMemberGender === "無回答" ? "bg-gray-500" : "bg-gray-200"
                  }`}
                  onPress={() => setNewMemberGender("無回答")}
                >
                  <Text
                    className={`${
                      newMemberGender === "無回答" ? "text-white" : "text-black"
                    }`}
                  >
                    無回答
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="items-center mt-5">
                <TouchableOpacity
                  className={`rounded-lg p-2 m-2 ${
                    newMemberName.trim() && newMemberGender
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                  onPress={setMember}
                  disabled={!newMemberName.trim() || !newMemberGender}
                >
                  <Text className="text-white font-bold">追加</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                top: 448,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                className="bg-black rounded-lg p-2 m-2"
                onPress={resetIcon}
              >
                <Text className="text-white font-bold">戻る</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
  },
});

export default HomeScreen;
