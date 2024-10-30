import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
const App = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async () => {
    try {
      const response = await axios.get("http://mgt2.pnu.ac.th/jakpong/6460704003/get_image.php");
     setImages(response.data);
    }
    catch (error) {
      console.error("Error fetching images", error);
    }
  };
  // Function to select an image
  const pickImage = async () => {
    const permissionResult = await
      ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  // Function to upload image
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    setStatus("Uploading...");

    try {
      const fileUri = image.uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const base64Image = `data:${image.type};base64,${fileContent}`;

      const uploadResponse = await axios.post("http://mgt2.pnu.ac.th/jakpong/6460704003/upload.php", {
      file: base64Image,
        fileName: image.fileName || `photo_${Date.now()}.jpg`,
    });

    const imagePath = uploadResponse.data.filePath;
    const currentDatetime = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Save image metadata to MySQL without `id`
    const metadataResponse = await axios.post("http://mgt2.pnu.ac.th/jakpong/6460704003/save_image_metadata.php", {
      img: imagePath,
      datetime: currentDatetime,
    });

  console.log("Metadata response:", metadataResponse.data);

  setStatus("Upload successful!");
  fetchImages();  // Fetch updated images after upload
} catch (error) {
  console.error("Upload failed", error);
  setStatus("Upload failed.");
}
};


const renderItem = ({ item }) => {
  

  return (
    <View style={styles.imageContainer}>
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }}
        source={{ uri: "http://mgt2.pnu.ac.th/jakpong/6460704003/uploads/" + item.img }}
      />
      <Text style={styles.date}>{item.datetime}</Text>
    </View>
  );
};

return (
  <View style={{
    flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:
      200
  }}>
    <Button title="Pick an image from camera roll" onPress={pickImage} />
    {image && (
      <Image source={{ uri: image.uri }} style={{
        width: 200, height: 200,
        marginTop: 10
      }} />
    )}
    <Button title="Upload Image" onPress={uploadImage} />
    <Text style={{ marginTop: 10 }}>{status}</Text>
    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}  // This line should have access to `renderItem`
      style={styles.imageList}
    />
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  imageList: {
    marginTop: 20,
    width: '100%',
  },
});
export default App;