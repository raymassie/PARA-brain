---
created: 2026-08-27
tags: [resource]
---

# Modem status capture, 2026-08-26

ARRIS SURFboard SB8200 cable modem status page, captured 2026-08-26 (the
page's own system clock read Wed Aug 26 08:28:56 2026). Two raw captures of
the same page, a PDF export and a screenshot, merged into this one note;
same information in both, nothing new between them.

Connection state at capture time: downstream locked, connectivity/boot
state/config file all OK, BPI+ security enabled, DOCSIS network access
allowed.

## Downstream bonded channels (QAM256)

All 32 locked. Power 3.9-4.5 dBmV, SNR/MER 43.5-43.9 dB across the board,
normal-looking numbers for a healthy DOCSIS 3.0 bonded connection. Corrected
and uncorrectable error counts vary by channel; most are clean, a handful
carry meaningful uncorrectables worth watching if problems come up (channels
1, 2, 3, and 5 in particular).

| Channel ID | Frequency | Power | SNR/MER | Corrected | Uncorrectables |
|---|---|---|---|---|---|
| 1 | 381 MHz | 4.2 dBmV | 43.8 dB | 75 | 50 |
| 2 | 387 MHz | 4.3 dBmV | 43.7 dB | 63 | 65 |
| 3 | 393 MHz | 4.0 dBmV | 43.8 dB | 66 | 42 |
| 4 | 399 MHz | 4.3 dBmV | 43.8 dB | 63 | 29 |
| 5 | 405 MHz | 4.2 dBmV | 43.8 dB | 57 | 41 |
| 6 | 411 MHz | 4.2 dBmV | 43.8 dB | 19 | 14 |
| 7 | 417 MHz | 4.4 dBmV | 43.8 dB | 37 | 28 |
| 8 | 423 MHz | 4.0 dBmV | 43.7 dB | 19 | 0 |
| 9 | 429 MHz | 4.4 dBmV | 43.9 dB | 0 | 0 |
| 10 | 435 MHz | 4.2 dBmV | 43.9 dB | 46 | 1 |
| 11 | 441 MHz | 4.0 dBmV | 43.7 dB | 15 | 0 |
| 12 | 447 MHz | 4.5 dBmV | 43.8 dB | 27 | 0 |
| 13 | 453 MHz | 4.1 dBmV | 43.7 dB | 36 | 0 |
| 14 | 459 MHz | 4.3 dBmV | 43.9 dB | 6 | 0 |
| 15 | 465 MHz | 4.3 dBmV | 43.7 dB | 21 | 0 |
| 16 | 471 MHz | 4.0 dBmV | 43.7 dB | 0 | 0 |
| 17 | 477 MHz | 4.5 dBmV | 43.8 dB | 0 | 0 |
| 18 | 483 MHz | 4.2 dBmV | 43.7 dB | 15 | 0 |
| 19 | 489 MHz | 4.1 dBmV | 43.8 dB | 0 | 0 |
| 20 | 495 MHz | 4.3 dBmV | 43.7 dB | 0 | 0 |
| 21 | 501 MHz | 3.9 dBmV | 43.6 dB | 8 | 0 |
| 22 | 507 MHz | 4.0 dBmV | 43.6 dB | 0 | 0 |
| 23 | 513 MHz | 4.1 dBmV | 43.8 dB | 0 | 0 |
| 24 | 519 MHz | 4.1 dBmV | 43.7 dB | 0 | 0 |
| 25 | 525 MHz | 4.2 dBmV | 43.8 dB | 0 | 0 |
| 26 | 531 MHz | 4.2 dBmV | 43.9 dB | 0 | 0 |
| 27 | 537 MHz | 4.1 dBmV | 43.7 dB | 0 | 0 |
| 28 | 543 MHz | 4.2 dBmV | 43.7 dB | 9 | 0 |
| 29 | 549 MHz | 4.2 dBmV | 43.6 dB | 0 | 0 |
| 30 | 555 MHz | 4.1 dBmV | 43.6 dB | 22 | 0 |
| 31 | 561 MHz | 4.3 dBmV | 43.5 dB | 95 | 0 |
| 32 | 567 MHz | 4.2 dBmV | 43.5 dB | 19 | 0 |

## Downstream OFDM channels

Two additional downstream channels stand out: IDs 193 and 194 ("Other" type,
722 MHz and 957 MHz). Both report a corrected-errors count of 2,185,006,598,
several orders of magnitude past any QAM256 channel, alongside 70
uncorrectables each, a real but comparatively small number next to that
corrected count. Worth a second look if internet issues come up again,
could be a genuine signal problem on the OFDM channels, or this could be
the known SB8200 firmware counter quirk that reports implausibly large
corrected-error totals on OFDM channels without it meaning anything is
actually wrong. Not enough in this single capture to say which.

| Channel ID | Frequency | Power | SNR/MER | Corrected | Uncorrectables |
|---|---|---|---|---|---|
| 193 | 722 MHz | 3.6 dBmV | 41.5 dB | 2,185,006,598 | 70 |
| 194 | 957 MHz | 0.0 dBmV | 41.2 dB | 2,185,006,598 | 70 |

## Upstream bonded channels (SC-QAM)

Both locked, 6.4 MHz wide.

| Channel ID | Frequency | Width | Power |
|---|---|---|---|
| 19 | 29.2 MHz | 6.4 MHz | 48.0 dBmV |
| 20 | 35.6 MHz | 6.4 MHz | 45.0 dBmV |
