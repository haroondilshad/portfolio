---
title: "Every Cursor message was costing me 14 GB of backup space"
date: 2026-10-23T04:45:00+02:00
description: "I lost weeks of Time Machine history to my editor's chat history. How one 14 GB SQLite file, and a few like it, filled my backup drive, and how I measured and fixed it."
tags: ["macos", "time-machine", "cursor", "backups", "developer-tools"]
keywords: ["Time Machine", "Cursor", "state.vscdb", "backup size", "SQLite", "tmutil", "APFS", "AI coding tools"]
author: "Haroon Dilshad"
---

My Time Machine drive has a 1 TB quota. When I finally looked at what was on it, it held eleven backups going back exactly three weeks. Everything from September was already gone, deleted by Time Machine to make room.

The reason turned out to be one file. Cursor keeps all of its chat and agent history in a single SQLite database, and on my machine that file had grown to 14 GB. Time Machine backs up whole files, so whenever that database changes between two backups, even by one message, the next backup stores a complete new 14 GB copy. My backup drive was holding ten of them.

## What was actually on the drive

I counted how many separate copies of each large file the eleven backups were holding (method further down). These five files alone took 184 GB:

| File | Separate copies | Space on the backup drive |
|---|---|---|
| Cursor chat history (`state.vscdb`) | 10 | 139.5 GB |
| Kilo session database | 3 | 14.7 GB |
| claude-mem vector index | 8 | 12.8 GB |
| screenpipe search index | 3 | 9.0 GB |
| Codex thread history | 8 | 8.3 GB |

Across all large files, 221 GB of the drive was copies of files that had changed between backups. A full backup of my Mac was 266 GB, and each new backup added about 41 GB on top of that. With numbers like that, a 1 TB drive fits roughly three weeks, which is exactly what I had.

## Why one message costs 14 GB

Time Machine works file by file. It doesn't look at which parts of a file changed; if the file is different, it copies all of it. That's fine for documents and source code, where files are small and most of them never change. It goes wrong with large databases that are written all the time.

Cursor's `state.vscdb` lives in `~/Library/Application Support/Cursor/User/globalStorage/`. Nearly all of it is agent and chat history: about 5.9 GB of agent state and 4.2 GB of chat messages in my case. Any chat, any agent run, any change at all, and the whole 14 GB file is "changed". It has almost no free space inside either, so compacting it with `VACUUM` won't shrink it.

Your Mac's own disk mostly doesn't notice. The local snapshots Time Machine keeps on the internal drive are block level, so they only hold the pages that changed. The damage happens on the backup drive, and it's quiet: no warning, no error, just old backups disappearing earlier than you'd expect.

## It's not just Cursor

The other files on the list have the same shape. AI tools tend to keep everything in one big local database or index: Kilo's sessions, claude-mem's vector store, screenpipe's search index, Codex's thread history. Each of them is copied in full on every backup where it changed.

Codex is a nice contrast, because it stores data both ways. Its conversation transcripts are lots of small files, one per session, and only the ones that changed get backed up: about 0.15 GB across three backups. Its thread history is a single 1.1 GB database, and the backup drive held eight copies of it.

So the problem isn't how much data a tool has. It's whether that data sits in one big file that changes constantly.

## How I measured it

On APFS, every Time Machine backup is a read-only snapshot. A file that didn't change between two backups is the same file in both snapshots, with the same inode number. A file that changed was copied again, so it gets a new inode. Counting distinct inodes for a path across all snapshots tells you how many full copies the drive is storing.

To look inside, mount a backup snapshot read-only (this needs `sudo` and a terminal with Full Disk Access while you do it):

```bash
diskutil apfs listSnapshots /Volumes/Backup        # names of your backups
sudo mkdir /tmp/tm
sudo mount_apfs -o rdonly,nobrowse -s com.apple.TimeMachine.<date>.backup /dev/<backup disk> /tmp/tm
sudo stat -f '%i %z' "/tmp/tm/<date>.backup/Macintosh HD - Data/Users/<you>/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
sudo umount /tmp/tm
```

Repeat for each backup and count the distinct inode numbers. I wrapped this in a script that does it for every large file, and a second one that compares consecutive backups file by file to show how much new data each backup stored, grouped by folder. That second view is the one to trust. It catches churn of any size, not only big files.

One more thing that tripped me up while measuring: Finder, `du` and the Storage panel in System Settings add up file sizes, and they count APFS clones as full copies. The only number that tells you what deleting something really frees is the volume's free space, so measure that before and after.

## What I changed

I excluded the files that churn the most and that I can live without restoring: Cursor's `globalStorage` folder and its `snapshots`, the screenpipe indexes, claude-mem's vector store, and the Codex thread history and logs. Things like my keychain, Photos, Messages and the Codex session transcripts stay in the backup.

There are two kinds of Time Machine exclusion, and the difference matters:

```bash
# Sticky: stored as a marker on the item itself. No admin rights, no Full Disk Access.
tmutil addexclusion "$HOME/Library/Application Support/Cursor/User/globalStorage"

# Fixed path: what the System Settings list uses. Needs sudo and Full Disk Access.
sudo tmutil addexclusion -p "/path/to/something"

# Check what Time Machine will do with a path:
tmutil isexcluded "$HOME/Library/Application Support/Cursor/User/globalStorage"
```

I went with sticky exclusions everywhere. I don't want any terminal to have Full Disk Access permanently: everything you run in it inherits that access, including every `npm install` postinstall script, which is exactly the kind of supply-chain exposure [I wrote about before](/blog/npm-supply-attacks). A marker does the job without any special access. Its one weakness is that if an app deletes and recreates the folder, the marker goes with it, so a small script runs weekly from launchd and puts the markers back.

## The result

I replayed my last few backups with the new exclusions applied:

| | Before | After |
|---|---|---|
| One full backup | 266 GB | 175 GB |
| New data per backup | 41 GB | 8 GB |
| History on a 1 TB drive | about 3 weeks | roughly 4 to 7 months |

The "before" estimate matches what I actually had, three weeks, so I trust the "after" one as a fair estimate. It won't happen overnight. On APFS backups you can't delete one file from old backups, only whole backups, so the existing copies of Cursor's database leave the drive as Time Machine thins out old backups over the next month.

## If you use Cursor

Check how big the file is:

```bash
ls -lh "$HOME/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
```

If it's in the gigabytes, every backup where you used Cursor is storing all of it again. Your options:

- **Exclude it.** Backups get much smaller, but if your disk dies, your Cursor chat history goes with it. Your code and settings are elsewhere and stay backed up.
- **Shrink it.** Delete old chats and agent runs inside Cursor. It's the history that makes the file big.
- **Keep it as it is,** knowing that it costs you backup history on every day you use Cursor.

It's worth doing the same check for any tool that keeps a large local database: AI coding tools, screen recorders, local vector stores and anything else built on SQLite. Time Machine has no idea that almost all of that file is the same as yesterday.
