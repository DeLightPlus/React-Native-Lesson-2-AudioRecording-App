import React, { useContext, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { FlatList, View, StyleSheet, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";


import { RecordingsContext } from "@/context/RecordingsContext";
import Settings from "@/app/settings";
import { Link } from "expo-router";


// All Recordings Preview Component
const AllRecordingsPreview = () => {
  const { recordings } = useContext(RecordingsContext);
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <View style={styles.previewContainer}>
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>📼 Recordings</Text>

        <View style={{flexDirection:"row", justifyContent: "space-between", width:"100%"}}>          
          <Picker
            selectedValue={selectedFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Favorites" value="favorites" />
            <Picker.Item label="Recent" value="recent" />
          </Picker>

          <TextInput 
            style={styles.searchInput} 
            placeholder="Search" 
            placeholderTextColor="#aaa" 
          />
        </View>
        
      </View>

      {recordings.length > 0 ? (
        <FlatList
          data={recordings} // Display all recordings
          renderItem={({ item }) => (
            <View style={styles.previewItem}>
              <Link href={`/playback/${item.id}`}>
                <Text style={styles.recordingName}>{item.name}</Text>
                <Text style={styles.recordingDuration}>{item.duration}</Text>
              </Link>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noRecordingsText}>
          No recordings available in storage.
        </Text>
      )}
    </View>
  );
};

// Main Drawer Layout
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <Drawer
        drawerContent={() => (
          <>            
            <Link href="/" style={styles.backLink}> <Text>↩ Audio Recorder</Text> </Link>  

            <AllRecordingsPreview /> 

            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <Link href="/settings" style={styles.backLink} > <Text>⚙️ Settings</Text></Link>   
            </View>          
          </>
        )}

        screenOptions={{
          headerShown: true, // Show header for better navigation
          title:"🎙️ Audio Recorder"
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: "🎙️ Audio Recorder" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// Styles
const styles = StyleSheet.create({
  backLink:{
    padding: 16,
    backgroundColor:"#f9f9f9",
    fontSize: 21
  },
  previewContainer: {
    padding: 16,
    backgroundColor: "lightgrey",
    flex: 1,
  },
  previewHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 50, 
    width: 128,
    fontSize: 16, 
    paddingHorizontal: 1, 
    // backgroundColor:"#fff",
  },
  searchInput: {
    flex: 1,
    marginLeft: -12,
    height: 50,
    borderBottomWidth: 1,
    
    borderBottomColor:"#fff",
    paddingHorizontal: 10,
    // backgroundColor: "#fff",
    color: "#333",
  },
  previewItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordingDuration: {
    fontSize: 14,
    color: "#666",
  },
  noRecordingsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});
