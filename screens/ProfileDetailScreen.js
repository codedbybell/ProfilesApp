import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Pressable,
} from 'react-native';
import { api } from '../api/client';

export default function ProfileDetailScreen({ route, navigation }) {
    const { id } = route.params; // Listeden gelen ID'yi alıyoruz
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/profiles/${id}`);
            setProfile(res.data);
        } catch (err) {
            setError('Failed to load profile details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={fetchProfile}>
                    <Text style={styles.retryText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Profile not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.name}>{profile.name}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{profile.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.value}>{profile.age}</Text>
                </View>

                {profile.phone && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{profile.phone}</Text>
                    </View>
                )}

                {profile.bio && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Bio</Text>
                        <Text style={styles.bioText}>{profile.bio}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF0F5',
    },
    card: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 25,
        padding: 24,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    header: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 20,
        marginBottom: 20,
    },
    largeAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFE4E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#DB7093',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    infoBox: {
        width: '100%',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#DB7093',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    value: {
        fontSize: 17,
        color: '#555',
    },
    bioSection: {
        backgroundColor: '#FFFBFC',
        padding: 12,
        borderRadius: 12,
    },
    bioText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        fontStyle: 'italic',
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