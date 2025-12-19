import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { api } from '../api/client';

export default function ProfilesListScreen({ navigation }) {
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchProfiles = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.get(`/profiles?page=${page}&limit=10`);

            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                setProfiles((prev) => [...prev, ...res.data]);
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            setError('Failed to load profiles. Check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const renderItem = ({ item }) => (
        <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('ProfileDetail', { id: item.id })}
        >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </Pressable>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    };

    if (error && profiles.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={fetchProfiles}>
                    <Text style={styles.retryText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onEndReached={fetchProfiles}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 15,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFE4E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#DB7093',
        fontWeight: 'bold',
        fontSize: 18,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
        color: '#9B9B9B',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF0F5',
    },
    errorText: {
        fontSize: 16,
        color: '#DB7093',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#FFB6C1',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});