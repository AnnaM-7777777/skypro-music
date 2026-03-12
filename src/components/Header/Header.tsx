import Image from 'next/image';

export default function Header() {
  return (
    <nav className={'main__nav'}>
      <div className={'nav__logo'}>
        <Image
          width={250}
          height={170}
          className={'logo__image'}
          src="/img/logo.png"
          alt={'logo'}
        />
      </div>
      <div className={'nav__burger'}>
        <span className={'burger__line'}></span>
        <span className={'burger__line'}></span>
        <span className={'burger__line'}></span>
      </div>
      <div className={'nav__menu'}>
        <ul className={'menu__list'}>
          <li className={'menu__item'}>
            <a href="#" className={'menu__link'}>
              Главное
            </a>
          </li>
          <li className={'menu__item'}>
            <a href="#" className={'menu__link'}>
              Мой плейлист
            </a>
          </li>
          <li className={'menu__item'}>
            <a href="/auth/signin" className={'menu__link'}>
              Войти
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
