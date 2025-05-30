import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image } from 'react-native';

export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://68395d2f6561b8d882b01864.mockapi.io/api/v1/Prodotti';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cella}>
                            <Text>{item.name}</Text>
                            <Text>€ {parseFloat(item.price).toFixed(2)}</Text>
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                        </View>
                    )}
                    refreshing={loading}
                    onRefresh={fetchData}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cella: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent: 'center',
        paddingLeft: 10,
    },
});