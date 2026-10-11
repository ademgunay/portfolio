---
title: Example post (template)
description: Copy this file to start a new post. Set draft to false to publish.
date: 2026-10-11
tags: [template]
draft: true
---

Intro paragraph. Write in plain Markdown.

## Kotlin

```kotlin
class SessionViewModel(private val repo: SessionRepository) : ViewModel() {
    val state = repo.observe().stateIn(viewModelScope, SharingStarted.Lazily, SessionState.Idle)
}
```

## Dart

```dart
class CartCubit extends Cubit<CartState> {
  CartCubit(this._repo) : super(const CartState.empty());
  final CartRepository _repo;

  Future<void> load() async => emit(CartState.loaded(await _repo.fetch()));
}
```
