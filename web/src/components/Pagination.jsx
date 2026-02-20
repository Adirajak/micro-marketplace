const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...styles.btn, ...(currentPage === 1 ? styles.disabled : {}) }}
      >
        ← Prev
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            ...styles.btn,
            ...(page === currentPage ? styles.active : {})
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...styles.btn, ...(currentPage === totalPages ? styles.disabled : {}) }}
      >
        Next →
      </button>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' },
  btn: {
    padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px',
    background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500',
    color: '#475569', transition: 'all 0.2s'
  },
  active: { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' },
  disabled: { opacity: 0.4, cursor: 'not-allowed' }
};

export default Pagination;