import styles from './PlayerControls.module.css';
import classNames from 'classnames';

export default function PlayerControls() {
    return (
        <div className={styles.playerControls}>
            <div className={styles.playerBtnPrev}>
                <svg className={styles.playerBtnPrevSvg}>
                    <use href='/img/icon/sprite.svg#icon-prev'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnPlay, styles.btn)}>
                <svg className={styles.playerBtnPlaySvg}>
                    <use href='/img/icon/sprite.svg#icon-play'></use>
                </svg>
            </div>

            <div className={styles.playerBtnNext}>
                <svg className={styles.playerBtnNextSvg}>
                    <use href='/img/icon/sprite.svg#icon-next'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnRepeat, styles.btnIcon)}>
                <svg className={styles.playerBtnRepeatSvg}>
                    <use href='/img/icon/sprite.svg#icon-repeat'></use>
                </svg>
            </div>

            <div className={classNames(styles.playerBtnShuffle, styles.btnIcon)}>
                <svg className={styles.playerBtnShuffleSvg}>
                    <use href='/img/icon/sprite.svg#icon-shuffle'></use>
                </svg>
            </div>
        </div>
    );
}
