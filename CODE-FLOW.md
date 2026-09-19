# Code Flow Guide (Beginner Friendly)

This repo teaches the same Movies CRUD app with four different state-management styles.
Checkout a branch, then follow the flow below for that branch.

| Branch | Pattern | Signals? | NgRx? |
|--------|---------|----------|-------|
| `main` | Component + RxJS `subscribe` | No | No |
| `feature/rxjs-crud` | Same as `main` (named learning branch) | No | No |
| `feature/ngrx-store` | Classic NgRx Store + Effects | No (optional `toSignal`) | Yes (Store/Effects) |
| `feature/signals-crud` | Angular Signals in components/services | Yes | No |
| `feature/ngrx-signals` | `@ngrx/signals` SignalStore | Yes | Yes (SignalStore) |

Shared pieces on every branch:

- `MovieAppService` — HTTP calls (`GET/POST/PUT/DELETE /movies`)
- `AppConfigService` — loads `/assets/app-config.json` at startup
- Routes under `/home`, `/home/create`, `/home/:id`, `/home/:id/edit`, `/home/:id/delete`
- Bootstrap 5 UI

API base URL comes from `src/assets/app-config.json` (`apiBaseUrl`).

---

## 1) `main` / `feature/rxjs-crud` — plain RxJS (no signals, no NgRx)

**Idea:** each component owns its own `loading` / `error` / data properties and calls the service with `.subscribe()`.

### App boot

1. `main.ts` → `bootstrapApplication(App, appConfig)`
2. `app.config.ts` → `provideRouter`, `provideHttpClient`, `provideAppInitializer(AppConfigService.load)`
3. `App` template renders nav + `<router-outlet>` + sidebar + footer

### List (`MovieList`)

```
URL /home
  → MovieList.ngOnInit()
  → MovieAppService.getMovies()          // Observable
  → subscribe({ next, error })
  → this.movies / this.loading / this.error
  → template binds plain properties (@if (loading), @for (movie of movies))
```

Why `subscribe` + `unsubscribe`? Observables stay open until completed/unsubscribed. Cleaning up in `ngOnDestroy` prevents leaks when leaving the page.

### Create (`MovieCreate`)

```
URL /home/create
  → user fills Reactive Form
  → save()
  → form.getRawValue() as CreateMovie
  → MovieAppService.createMovie(payload)
  → subscribe success → Router.navigate(['/home'])
```

Why Reactive Forms? Validators and a typed payload without manually reading each input.

### Details (`MovieDetails`)

```
URL /home/:id
  → read id from ActivatedRoute.snapshot.paramMap
  → MovieAppService.getMovieById(id)
  → subscribe → this.movie
```

### Edit (`MovieEdit`)

```
URL /home/:id/edit
  → getMovieById(id) → patchValue(form)
  → save() → updateMovie(id, payload) → navigate /home
```

### Delete (`MovieDelete`)

```
URL /home/:id/delete
  → getMovieById(id) for confirmation UI
  → confirmDelete() → deleteMovie(id) → navigate /home
```

---

## 2) `feature/ngrx-store` — classic NgRx Store + Effects

**Idea:** components dispatch **actions**. **Effects** call the API. **Reducers** update the store. Components **select** state.

### Boot extras

`app.config.ts` also has `provideStore({...features})` and `provideEffects([...])`.

### List flow

```
MovieList.ngOnInit()
  → store.dispatch(MoviesActions.loadMovies())
  → MoviesEffects.loadMovies$ listens
  → calls MovieAppService.getMovies()
  → dispatches loadMoviesSuccess / loadMoviesFailure
  → movies reducer updates state
  → MovieList selects movies$/loading$/error$ (or async pipe)
```

Why Effects? Keeps HTTP side-effects out of components so UI only says “what happened” (actions), not “how to call the API”.

### Create / Edit / Delete

Same pattern: dispatch → effect → success action → optional navigate in a non-dispatching effect → refresh list action.

---

## 3) `feature/signals-crud` — Angular Signals (no NgRx)

**Idea:** replace plain properties with `signal()` / `computed()`. Still call `MovieAppService`, but update signals in subscribe (or use `rxResource` / `toSignal` where helpful).

### List flow

```
MovieList.ngOnInit()
  → api.getMovies().subscribe(...)
  → movies.set(data); loading.set(false)
  → template uses movies() / loading()
```

Why signals? Fine-grained reactivity without Zone change-detection surprises, and a clear “read with `()`” mental model in templates.

---

## 4) `feature/ngrx-signals` — NgRx SignalStore

**Idea:** one `signalStore` holds state + methods. Components inject the store and call store methods; the store owns RxJS/`rxjsMethod` for HTTP.

### List flow

```
MovieList.ngOnInit()
  → moviesStore.loadMovies()
  → store rxMethod / effect calls MovieAppService
  → patchState({ movies, loading, error })
  → template: moviesStore.movies() / moviesStore.loading()
```

Why SignalStore? NgRx structure (single source of truth) with the modern signals API — less boilerplate than classic actions/reducers/effects for small apps.

---

## How to run any branch

```bash
git checkout <branch-name>
npm install --legacy-peer-deps
npm start
```

Point `src/assets/app-config.json` at your movies API, for example:

```json
{ "apiBaseUrl": "http://localhost:3000/api" }
```

---

## Mental model cheat sheet

| Question | RxJS branch | NgRx Store | Signals | NgRx Signals |
|----------|-------------|------------|---------|--------------|
| Where is state? | Component fields | Global Store | Component/service signals | SignalStore |
| Who calls HTTP? | Component | Effect | Component/service | Store method |
| How does UI update? | Assign properties | Selectors | `signal.set` | `patchState` |
| Best for learning? | First | Large apps / shared state | Modern Angular UI state | Modern NgRx |
