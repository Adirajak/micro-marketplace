import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator, Image, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const { user, updateFavorites } = useAuth();
  const router = useRouter();

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const params = new URLSearchParams({ page: currentPage, limit: 8 });
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);

      const { data } = await API.get(`/products?${params}`);
      if (reset) {
        setProducts(data.data);
        setPage(1);
      } else {
        setProducts(prev => currentPage === 1 ? data.data : [...prev, ...data.data]);
      }
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(true); }, [search, category]);

  const onRefresh = () => { setRefreshing(true); fetchProducts(true); };

  const loadMore = () => {
    if (!loadingMore && page < (pagination.pages || 1)) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) fetchProducts();
  }, [page]);

  const toggleFavorite = async (product) => {
    if (!user) return router.push('/(auth)/login');
    const isFav = user.favorites?.includes(product._id);
    try {
      if (isFav) {
        const { data } = await API.delete(`/favorites/${product._id}`);
        updateFavorites(data.data);
      } else {
        const { data } = await API.post(`/favorites/${product._id}`);
        updateFavorites(data.data);
      }
    } catch (err) { console.error(err); }
  };

  const renderProduct = ({ item }) => {
    const isFav = user?.favorites?.includes(item._id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: item._id } })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/300' }}
          style={styles.cardImage}
        />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.heartIcon}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{item.category}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.cardRating}>⭐ {item.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Marketplace</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, category === cat && styles.catPillActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ padding: 20 }} color="#6366f1" /> : null}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#6366f1', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  searchInput: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15
  },
  categories: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 60 },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#fff', marginRight: 8, borderWidth: 1.5, borderColor: '#e2e8f0'
  },
  catPillActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  catText: { fontSize: 13, fontWeight: '500', color: '#475569' },
  catTextActive: { color: '#fff' },
  list: { paddingHorizontal: 8, paddingBottom: 20 },
  row: { justifyContent: 'space-between', paddingHorizontal: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    width: '47%', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4
  },
  cardImage: { width: '100%', height: 140 },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center'
  },
  heartIcon: { fontSize: 16 },
  cardBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(99,102,241,0.9)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2
  },
  cardBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  cardDesc: { fontSize: 11, color: '#94a3b8', lineHeight: 16, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#6366f1' },
  cardRating: { fontSize: 11, color: '#f59e0b' },
  emptyView: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#94a3b8', fontSize: 16 }
});