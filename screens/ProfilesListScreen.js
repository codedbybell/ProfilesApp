import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { api } from '../api/client';

export default function ProfilesListScreen({ navigation }) {
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
            setError(err.message || 'Profiller yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await api.get(`/profiles?page=1&limit=10`);
            setProfiles(res.data);
            setPage(2);
            setHasMore(res.data.length > 0);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
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
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
        </Pressable>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#FFB6C1" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Profil bulunamadı</Text>
            </View>
        );
    };

    if (loading && profiles.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FFB6C1" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (error && profiles.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={onRefresh}>
                    <Text style={styles.retryText}>Tekrar Dene</Text>
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
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#DB7093']}
                        tintColor={'#DB7093'}
                    />
                }
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
        flexGrow: 1,
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
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
    infoContainer: {
        flex: 1,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#DB7093',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#DB7093',
    },
    errorText: {
        fontSize: 16,
        color: '#DB7093',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#FFB6C1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});