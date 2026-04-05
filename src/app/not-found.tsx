import { link } from 'fs/promises';
import Link from 'next/link';

export default function NotFound() {
    /* return <Link href={'./music/main'}>На главную</Link>; */
    return <Link href={'/'}>На главную</Link>;
}
