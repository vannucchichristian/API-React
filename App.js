import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductImage, setNewProductImage] = useState('');
    const [errors, setErrors] = useState({});  // Oggetti di JavaScript, simili ai dizionari di Python

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

    const validateForm = () => {
        const newErrors = {};
        // Se il campo del nome è vuoto
        if (!newProductName.trim()) newErrors.name = "Il nome è obbligatorio";
        if (!newProductPrice.trim()) {
            newErrors.price = "Il prezzo è obbligatorio";
        } else if (isNaN(newProductPrice) || Number(newProductPrice) <= 0) {
            newErrors.price = "Inserisci un prezzo valido";
        }
        if (!newProductImage.trim()) newErrors.image = "L'URL dell'immagine è obbligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;  // Conta il numero di chiavi dell'oggetto newErrors e controlla se sono 0 (form accettato) o no
    };

    const addItem = async () => {
        if (!validateForm()) return;
        try {
            // Crea una richiesta HTTP con metodo POST
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  // Converte l'oggetto JavaScript in una stringa JSON
                    name: newProductName,
                    price: newProductPrice,
                    image: newProductImage,
                    createdAt: new Date().toISOString(),  // Converte la data nel formato ISO standard
                }),
            });
            setModalVisible(false);
            // Azzera tutte le variabili del form
            setNewProductName('');
            setNewProductPrice('');
            setNewProductImage('');
            setErrors({});
            fetchData();
        } catch (error) {
            console.error("Errore nell'aggiunta: ", error);
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
                                    source={{ uri: item.image || 'https://via.placeholder.com/50' }}  // Usa immagine segnaposto se mancante
                                    style={styles.immagine}
                                />
                                <View>
                                    <Text style={styles.titolo}>{item.name}</Text>
                                    <Text style={styles.prezzo}>€ {parseFloat(item.price).toFixed(2)}</Text>
                                    {/* Scrive la data di creazione del prodotto in formato leggibile */}
                                    <Text style={styles.data}>{new Date(item.createdAt).toLocaleString()}</Text>
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

            {/* Pulsante aggiunta prodotto */}
            <TouchableOpacity style={styles.bottoneAggiungi} onPress={() => setModalVisible(true)}>
                <Text style={styles.testoBottone}>＋</Text>
            </TouchableOpacity>

            {/* Modale aggiunta prodotto */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Nome prodotto"
                        value={newProductName}
                        onChangeText={setNewProductName}
                        style={styles.input}
                    />
                    {/* Mostra il messaggio di errore solo se errors.name contiene qualcosa */}
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <TextInput
                        placeholder="Prezzo"
                        value={newProductPrice}
                        onChangeText={setNewProductPrice}
                        style={styles.input}
                        keyboardType="decimal-pad"
                    />
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                    <TextInput
                        placeholder="URL immagine"
                        value={newProductImage}
                        onChangeText={setNewProductImage}
                        style={styles.input}
                    />
                    {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                    <Button title="Aggiungi" onPress={addItem} />
                    <Button title="Annulla" color="red" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    cella: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 2,
        justifyContent: 'space-between',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    immagine: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 8,
    },
    titolo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    prezzo: {
        color: '#1b76b8',
        marginTop: 4,
    },
    data: {
        fontSize: 12,
        color: '#666',
    },
    cestino: {
        fontSize: 24,
        marginLeft: 10,
        color: 'red',
    },
    bottoneAggiungi: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#1b76b8',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    testoBottone: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});