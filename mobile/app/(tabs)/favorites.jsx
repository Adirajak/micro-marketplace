import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateFavorites } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites');
      setFavorites(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const removeFavorite = async (productId) => {
    try {
      const { data } = await API.delete(`/favorites/${productId}`);
      updateFavorites(data.data);
      setFavorites(prev => prev.filter(p => p._id !== productId));
    } catch (err) { console.error(err); }
  };

  if (loading) return <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️ Favorites</Text>
        <Text style={styles.headerSub}>{favorites.length} saved items</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.browseBtn}>
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item._id } })}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.image }} style={styles.img} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item._id)} style={styles.removeBtn}>
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#6366f1', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3
  },
  img: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#6366f1', marginBottom: 2 },
  cardCategory: { fontSize: 11, color: '#94a3b8' },
  removeBtn: {
    padding: 12, justifyContent: 'center', alignItems: 'center'
  },
  removeIcon: { fontSize: 16, color: '#ef4444' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#475569', marginBottom: 20 },
  browseBtn: {
    backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12
  },
  browseBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 }
});