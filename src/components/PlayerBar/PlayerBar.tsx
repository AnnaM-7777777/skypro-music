import PlayerControls from './PlayerControls';
import NowPlaying from './NowPlaying';
import VolumeControl from './VolumeControl';

export default function PlayerBar() {
  return (
    <div className={'bar'}>
      <div className={'bar__content'}>
        <div className={'bar__playerProgress'}></div>
        <div className={'bar__playerBlock'}>
          <div className={'bar__player'}>
            <PlayerControls />
            <NowPlaying />
          </div>
          <VolumeControl />
        </div>
      </div>
    </div>
  );
}