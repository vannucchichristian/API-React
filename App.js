import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

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
            console.error("Errore nella richiesta/risposta HTTP: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Viene passato l'id del prodotto che deve essere cancellato
    const deleteItem = async (id) => {
        try {
            // Invia una richiesta HTTP con metodo DELETE per cancellare il prodotto
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Errore nella cancellazione: ", error);
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
                            <View style={styles.info}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                />
                                <View style={styles.testi}>
                                    <Text>{item.name}</Text>
                                    <Text>€ {parseFloat(item.price).toFixed(2)}</Text>
                                </View>
                            </View>
                            {/* Ogni prodotto ha un id, usato dal pulsante del cestino per cancellare quello giusto */}
                            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                                <Text style={styles.cestino}>🗑</Text>
                            </TouchableOpacity>
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
        paddingTop: 50,
    },
    cella: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    testi: {
        marginLeft: 10,
    },
    cestino: {
        fontSize: 24,
        color: 'red',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});