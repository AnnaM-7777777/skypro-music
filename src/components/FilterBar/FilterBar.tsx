export default function FilterBar() {
  return (
    <div className={'centerblock__filter'}>
      <div className={'filter__title'}>Искать по:</div>
      <div className={'filter__button'}>исполнителю</div>
      <div className={'filter__button'}>году выпуска</div>
      <div className={'filter__button'}>жанру</div>
    </div>
  );
}