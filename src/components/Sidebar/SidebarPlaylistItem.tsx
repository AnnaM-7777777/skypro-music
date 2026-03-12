import Image from 'next/image';

interface SidebarPlaylistItemProps {
  src: string;
  alt: string;
  href?: string;
}

export default function SidebarPlaylistItem({
  src,
  alt,
  href = '#',
}: SidebarPlaylistItemProps) {
  return (
    <div className={'sidebar__item'}>
      <a className={'sidebar__link'} href={href}>
        <Image
          className={'sidebar__img'}
          src={src}
          alt={alt}
          width={250}
          height={170}
          style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}
          sizes="(max-width: 768px) 100vw, 250px"
        />
      </a>
    </div>
  );
}