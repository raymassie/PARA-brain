---
created: 2026-08-27
tags: [resource]
---

# Modem status capture — 2026-08-26

ARRIS SURFboard SB8200 cable modem status page, captured 2026-08-26 (the
page's own system clock read Wed Aug 26 08:28:56 2026). Two raw captures of
the same page — a PDF export and a screenshot — merged into this one note;
same information in both, nothing new between them.

Connection state at capture time: downstream locked, connectivity/boot
state/config file all OK, BPI+ security enabled, DOCSIS network access
allowed.

32 downstream QAM256 channels locked (channel IDs 1–32, 381–567 MHz),
power 3.9–4.5 dBmV, SNR/MER 43.4–43.9 dB — normal-looking numbers for a
healthy DOCSIS 3.0 bonded connection.

Two additional downstream OFDM channels stand out (IDs 193 and 194,
"Other" type, 722 MHz and 957 MHz): both report a corrected-errors count of
2,185,006,598 — several orders of magnitude past every QAM256 channel's
count (all 0–95). Worth a second look if internet issues come up again —
could be a real signal problem on the OFDM channels, or a display/counter
quirk in this modem's firmware. Not enough in this single capture to say
which.

2 upstream SC-QAM channels locked (IDs 19 and 20, 29.2 MHz and 35.6 MHz),
power 48.0 and 45.0 dBmV.
