import styles from './SearchBar.module.css';

export default function SearchBar() {
  return (
    <div className={styles.centerblockSearch}>
      <svg className={styles.searchSvg}>
        <use href="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.searchText}
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
  );
}