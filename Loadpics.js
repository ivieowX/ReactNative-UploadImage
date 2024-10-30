import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";

const Loadpics = () => {
    const [list, setList] = useState([]);

    const Loadpic = async () => {
        try {
            await fetch("http://mgt2.pnu.ac.th/jakpong/uploadimage/Loadpic.php")
                .then((response) => response.json())
                .then((json) => {
                    setList(json);
                })
                .catch((error) => {
                    console.log("Error fetching data: ", error);
                });
        } catch (err) {
            console.log("Error in Loadpic function: ", err);
        }
    };

    useEffect(() => {
        Loadpic();
    }, []);

    if (!list || list.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>กำลังโหลด...</Text>
            </View>
        );
    } else {
        return (
            <ScrollView>
                {list.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            flex: 1,
                            padding: 10,
                            backgroundColor: "#fff",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            borderBottomColor: "#efefef",
                            borderBottomWidth: 2,
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    resizeMode: "cover",
                                }}
                                source={{
                                    uri: "http://mgt2.pnu.ac.th/jakpong/uploadimage/uploads/" + item.img,
                                }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
                            <Text>John Smith</Text>
                            <Text>john@gmail.com</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    }
};

export default Loadpics;
