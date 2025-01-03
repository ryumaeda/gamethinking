import React, { useState } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import thinkGame from "../lib/thinkGame";

interface HandleThinkGameButtonProps {
  navigate: (screen: string, props: any) => void;
  members: {
    name: string;
    gender: string;
  }[];
  gameRequest: string;
  buttonText: string;
  onThinkGame: () => void;
}

const HandleThinkGameButton = ({
  navigate,
  members,
  gameRequest,
  buttonText,
  onThinkGame,
}: HandleThinkGameButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleThinkGame = async () => {
    onThinkGame();
    setLoading(true);
    const content = `
以下に沿った飲みゲームを考えてください。
・ルールが簡単で分かりやすいゲームを考えてください。
・場が盛り上がる様な面白いゲームを考えてください。
・しりとりは禁止です。
・#メンバー、#要望に記載があれば その内容を反映してください。
・#要望に特に記載が無ければ、サイコロやトランプ等の準備物が不要なゲームを考えてください。
・「タイトル:」「ルール:」の形式で300文字以内で記載してください。
・ルールに関係しない内容は一切記載しないでください。
・項番をつけて具体的なルールを記載してください。
・役割がある場合は誰がどの役割を担うかも最初に指定してください。
#メンバー
${members
  .map((member) => `名前: ${member.name}, 性別: ${member.gender}`)
  .join("\n")}
#要望
${gameRequest}
    `;
    try {
      const response = await thinkGame(content);
      navigate("GameResult", {
        gameResponse: response,
        members: members,
        gameRequest: gameRequest,
      });
    } catch (error) {
      console.error("Error generating game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          className="bg-gray-800 rounded-lg p-2 m-2 mt-5"
          onPress={handleThinkGame}
        >
          <Text className="text-white font-bold text-center">{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HandleThinkGameButton;
