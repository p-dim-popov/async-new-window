import {SimpleEmitter} from "./simple-emitter";
import {Snapshot} from "./snapshot";

export type LoadingView = string | (() => string);

export type WindowOptions = {
  loadingView?: LoadingView;
  url?: string;
  target?: string;
}

export type InitiateWindowOptions = Omit<WindowOptions, 'url'>;

const DEFAULT_NEW_WINDOW_OPTIONS = {
  loadingView: 'about:blank',
  target: '_blank',
  url: undefined,
} satisfies WindowOptions;

export class AsyncNewWindow {
  private readonly _emitter = SimpleEmitter();

  private _hasFailed: boolean = false;
  private _window: Window | null = null;
  private _lastInitiationOptions: InitiateWindowOptions | undefined = undefined;

  private readonly _snapshot = Snapshot([this._hasFailed, this._window, this._lastInitiationOptions]);

  constructor(public windowOptions: WindowOptions = DEFAULT_NEW_WINDOW_OPTIONS) {}

  get hasFailed() {
    return this._hasFailed;
  }

  subscribe = (listener: () => void) => {
    return this._emitter.addListener(listener);
  }

  getSnapshot = (): readonly unknown[] => {
    return this._snapshot.calculate([this._hasFailed, this._window, this._lastInitiationOptions]);
  }

  initiate = (dynamicOptions?: InitiateWindowOptions) => {
    const target = dynamicOptions?.target ?? this.windowOptions.target ?? DEFAULT_NEW_WINDOW_OPTIONS.target;

    if (
      this._window
      && !this._window.closed
      && this._lastInitiationOptions?.target === target
      && target !== '_blank'
    ) {
      this._window.focus();
      return;
    }

    this._hasFailed = false;

    const loadingView = this.resolveInitialUrl(dynamicOptions?.loadingView);
    console.log('loadingView', loadingView)

    this._window = window.open(loadingView, target);
    this._lastInitiationOptions = { loadingView, target };

    if (!this._window) {
      this._hasFailed = true;
    }

    this._emitter.emit();
  }

  private resolveInitialUrl(maybeLoadingView?: LoadingView): string {
    const loadingView = maybeLoadingView || this.windowOptions.loadingView || DEFAULT_NEW_WINDOW_OPTIONS.loadingView;

    if (typeof loadingView === 'string') return loadingView;

    return loadingView();
  }

  navigate = (maybeUrl?: string) => {
    if (!this._window) return;
    if (this._window.closed) {
      this._window = null;
      this._emitter.emit();
      return;
    }

    const url = maybeUrl || this.windowOptions.url || DEFAULT_NEW_WINDOW_OPTIONS.url;

    if (!url) return;

    this._window?.location.replace(url);
    this._window = null;

    this._emitter.emit();
  }
}

// const sleepAsync = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

