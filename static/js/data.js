const CURRICULUM = {
  pillars: [
    {
      id: "python",
      title: "Python & DSA",
      icon: "⌨",
      color: "#6EE7B7",
      desc: "The code fundamentals every AI engineer interview tests",
      lessons: [
        {
          id: "lists-dicts",
          title: "Lists, Dicts & Sets",
          tag: "foundation",
          summary: "90% of interview problems reduce to manipulating these three. Master them before anything else.",
          concepts: [
            {
              title: "List operations & complexity",
              body: `Python lists are dynamic arrays — contiguous blocks of memory that double in size when full. This doubling strategy is why append() is O(1) amortized: occasionally Python must copy the whole list to a larger buffer (O(n)), but it happens so rarely the average cost per append stays O(1).

The operation that kills most interview solutions: pop(0) is O(n) because every remaining element must shift one position left. Calling pop(0) inside a loop gives you O(n²) — interviewers watch for this. Use collections.deque if you need O(1) removal from both ends.

insert(i, x) is also O(n) — everything from index i onward shifts right. The only cheap operations are at the tail: append() and pop() are both O(1).

Critical 2D grid trap: [[0]*cols]*rows creates N references to the SAME inner list. Modify one cell and the whole column changes. Always use [[0]*cols for _ in range(rows)] — each row is a fresh list.

List slicing (nums[a:b]) creates a new list in O(k) where k = slice length. It doesn't modify in-place. This matters for space complexity.`,
              code: `nums = [3, 1, 4, 1, 5]
nums.append(9)        # O(1) amortized ✓
nums.pop()            # O(1) — removes last
nums.pop(0)           # O(n) — shifts entire list, AVOID in loops
nums.insert(2, 99)    # O(n) — shifts from index 2 onward
nums.sort()           # O(n log n) — Timsort (stable)

# 2D grid — DO THIS:
grid = [[0]*3 for _ in range(3)]
grid[0][0] = 9
print(grid)  # only row 0 changed ✓

# NOT THIS — all rows share the same inner list:
bad = [[0]*3]*3
bad[0][0] = 9
print(bad)   # EVERY row changed ✗

# Enumerate instead of range(len()) — always
for i, val in enumerate(nums):
    print(i, val)

# List comprehension with condition
squares = [x**2 for x in nums if x > 2]`
            },
            {
              title: "Dicts: trade space for time",
              body: `Python dicts are hash maps — they convert keys to integer hashes, then use those to find a bucket in O(1). Average-case O(1) for get, set, delete, and membership checks. This is the single most important data structure in coding interviews.

The core pattern: whenever you're doing repeated lookups in a list (O(n) each), ask yourself if you can build a dict first (O(n) once) and then do O(1) lookups. This insight alone converts dozens of O(n²) brute-force solutions into O(n).

Since Python 3.7, dicts are ordered by insertion. This matters: dict.keys(), dict.values(), dict.items() iterate in insertion order — useful when order matters.

Three tools for frequency counting, ranked by cleanliness:
1. dict.get(key, 0) — manual, verbose
2. defaultdict(int) — cleaner, no KeyError
3. Counter — purpose-built, has most_common(), subtraction, intersection

dict.get(key, default) never raises KeyError. Use it instead of dict[key] when you're not sure a key exists.`,
              code: `from collections import defaultdict, Counter

# 1. Manual — verbose but explicit
freq = {}
for ch in "hello world":
    freq[ch] = freq.get(ch, 0) + 1

# 2. defaultdict — no KeyError, clean
freq = defaultdict(int)
for ch in "hello world":
    freq[ch] += 1

# 3. Counter — most powerful for frequency problems
freq = Counter("hello world")
print(freq.most_common(3))   # [('l', 3), ('o', 2), ('h', 1)]

# Grouping with defaultdict(list) — very common pattern
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
groups = defaultdict(list)
for w in words:
    key = tuple(sorted(w))   # canonical anagram key
    groups[key].append(w)
print(list(groups.values()))

# dict comprehension
squares = {x: x**2 for x in range(6)}
# {0:0, 1:1, 2:4, 3:9, 4:16, 5:25}

# Safe lookup
d = {"a": 1}
print(d.get("b", 0))   # 0 — no KeyError`
            },
            {
              title: "Sets: O(1) membership checks",
              body: `Sets use the same hash table mechanism as dicts but store only keys (no values). Primary use: O(1) membership testing — "have I seen this element before?" Checking x in my_list is O(n). Checking x in my_set is O(1).

The classic pattern: convert a list to a set before doing repeated membership checks. If you check x in list inside a loop, you have O(n²) code. Convert once to a set (O(n)) and all subsequent lookups are O(1) — total O(n + k) instead of O(n·k).

Set operations work on the entire collection at once and are often cleaner than nested loops:
— a & b: intersection (elements in both)
— a | b: union (elements in either)
— a - b: difference (in a but not b)
— a ^ b: symmetric difference (in exactly one)

Important limitations: sets are unordered. You cannot index them (no set[0]). If you need ordered unique elements, use list(dict.fromkeys(items)) which preserves insertion order.

frozenset is an immutable, hashable set — useful as a dict key, which enables clever solutions for "find groups of equivalent items" problems.`,
              code: `# O(n) duplicate detection — not O(n²)
def has_duplicate(nums):
    return len(set(nums)) != len(nums)

# "Have I seen this?" pattern
def first_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return n
        seen.add(n)
    return -1

print(first_duplicate([1, 3, 2, 3, 4]))   # 3

# Set operations — cleaner than nested loops
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)   # intersection:  {3, 4}
print(a | b)   # union:         {1,2,3,4,5,6}
print(a - b)   # difference:    {1, 2}
print(a ^ b)   # sym diff:      {1,2,5,6}

# Ordered unique elements
nums = [3, 1, 4, 1, 5, 9, 2, 6, 5]
unique_ordered = list(dict.fromkeys(nums))
print(unique_ordered)   # [3, 1, 4, 5, 9, 2, 6]`
            },
            {
              title: "Python gotchas interviewers plant in test cases",
              body: `These are not obscure — interviewers deliberately include inputs that trigger these bugs. Know them cold before your interview.

Mutable default arguments: def f(lst=[]) — the list is created ONCE when the function is defined, not each call. All calls share the same list. Always use def f(lst=None): lst = [] if lst is None else lst.

The 2D grid trap (covered in Lists, but worth repeating): [[0]*n]*n creates n references to ONE inner list. Use [[0]*n for _ in range(n)].

Integer division direction: -7 // 2 = -4 (floors toward negative infinity), not -3. This breaks off-by-one logic in binary search and midpoint calculations. Python floor division always rounds toward -∞.

Ceiling division without imports: use -(-a // b). This works because double negation flips the floor direction.

is vs ==: is checks object identity, == checks value equality. CPython caches small integers (-5 to 256), so x is y might accidentally be True for small ints — never use is to compare values.

Chained comparisons work in Python: 1 < x < 10 is valid and means (1 < x) and (x < 10). Many interviewers are impressed when you use this.`,
              code: `# Mutable default argument trap
def append_to(val, lst=[]):   # BAD — lst shared across calls
    lst.append(val)
    return lst

print(append_to(1))   # [1]
print(append_to(2))   # [1, 2]  ← not [2]!

def append_to_fixed(val, lst=None):   # GOOD
    if lst is None:
        lst = []
    lst.append(val)
    return lst

# Floor division direction
print(7 // 2)    #  3
print(-7 // 2)   # -4  ← floors toward -infinity!

# Ceiling division trick
def ceil_div(a, b):
    return -(-a // b)

print(ceil_div(7, 2))   # 4
print(ceil_div(6, 2))   # 3

# is vs ==
a = 1000
b = 1000
print(a == b)   # True (equal value)
print(a is b)   # False (different objects)

# Chained comparisons
x = 5
print(1 < x < 10)       # True — Pythonic!
print(x == 5 == 5)      # True — also valid`
            },
            {
              title: "Big O analysis — state it for every solution",
              body: `Interviewers expect you to volunteer complexity analysis without being asked. If you wait to be prompted, it signals inexperience. After writing your solution, immediately say "this is O(n) time, O(n) space."

The rules: Drop constants and lower-order terms. O(2n) = O(n). O(n² + n) = O(n²). O(3) = O(1).

The complexity ladder you need to know:
O(1) — hash map lookup, array index, stack push/pop, deque append
O(log n) — binary search, balanced BST, heap push/pop
O(n) — single pass, hash map build, linear scan
O(n log n) — sorting, divide-and-conquer
O(n²) — nested loops, comparing every pair
O(2ⁿ) — exponential — backtracking without memoization
O(n!) — permutations — only valid for n ≤ ~10

Space complexity counts extra memory, not input size. Two-pointer solution = O(1) space. Hash map = O(n). Recursion stack = O(depth).

The best answer format: "My solution is O(n) time and O(n) space — I'm trading space for time by using the hash map. If we needed O(1) space, we could sort first and use two pointers in O(n log n) time." Mentioning the trade-off is what separates good candidates.`,
              code: `# Same problem, 3 different complexities — know all of them

# O(n²) time, O(1) space — brute force, mention it first then improve
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# O(n) time, O(n) space — optimal for unsorted
def two_sum_hashmap(nums, target):
    seen = {}   # value -> index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i

# O(n log n) time, O(1) space — if you can sort
def two_sum_sort(nums, target):
    indexed = sorted(enumerate(nums), key=lambda x: x[1])
    l, r = 0, len(indexed) - 1
    while l < r:
        s = indexed[l][1] + indexed[r][1]
        if s == target:   return [indexed[l][0], indexed[r][0]]
        elif s < target:  l += 1
        else:             r -= 1

# When asked "can you do better?", walk through these three
# and explain each trade-off explicitly`
            }
          ],
          quiz: [
            {
              q: "What is the time complexity of `x in my_list` vs `x in my_set`?",
              options: ["Both O(1)", "List O(n), Set O(1)", "List O(log n), Set O(1)", "Both O(n)"],
              answer: 1,
              explain: "A list scans every element to check membership — O(n). A set uses a hash table so lookup is O(1). This is why you convert to a set before doing repeated membership checks."
            },
            {
              q: "What does `[[0]*3]*3` create in Python?",
              options: ["A 3×3 grid of independent zeros", "3 references to the same inner list", "A tuple of 3 lists", "A SyntaxError"],
              answer: 1,
              explain: "The * operator on lists creates references, not copies. All 3 rows point to the same list object. Modifying grid[0][0] changes all rows. Always use [[0]*3 for _ in range(3)]."
            },
            {
              q: "What is `(-7) // 2` in Python?",
              options: ["-3", "-4", "-3.5", "3"],
              answer: 1,
              explain: "Python's floor division always rounds toward negative infinity. -7/2 = -3.5, floored to -4. This differs from C++/Java which truncate toward zero (giving -3). This bites you in binary search midpoint calculations."
            },
            {
              q: "You need to check 'is X in this collection?' 10,000 times on 1 million items. What do you do first?",
              options: ["Sort and binary search", "Convert list to set once, then check", "Use filter() each time", "Use a nested loop"],
              answer: 1,
              explain: "Convert to set: O(n) once, then O(1) per lookup. Total: O(n + 10000). The loop approach is O(n × 10000) = O(10 billion operations). Sets are the right tool here."
            }
          ],
          starter: `# Try it: find the two most common words in this sentence
sentence = "to be or not to be that is the question to be"
words = sentence.split()

# Your turn: use Counter to find the top 2 words
# Expected: [('to', 3), ('be', 3)]
from collections import Counter
`
        },
        {
          id: "hashmaps",
          title: "Hashmap Patterns",
          tag: "core pattern",
          summary: "The most important interview pattern. When a problem feels O(n²), a hashmap usually makes it O(n).",
          concepts: [
            {
              title: "Two Sum — the universal template",
              body: `Two Sum is not just one problem — it's a template that solves roughly 30% of easy/medium hashmap problems. The mental model: as you scan left to right, ask "do I already have what I need to complete the answer?" If yes, return it. If no, store the current element so a future element can find it.

The dict maps value → index. When you're at index i with value n, you need target - n. You look up target - n in the dict — if it's there, you found your pair.

Why scan and store simultaneously rather than build the map first, then scan? Because you'd need to handle duplicate elements (if target = 2*nums[i], the same index would match itself). The simultaneous approach handles this naturally: you only look up before you insert.

This same "store complement, look it up later" pattern generalises: Two Sum II (sorted array, use two pointers instead), 3Sum (sort + two pointers as inner loop), 4Sum, and dozens of variants. Once you see the template clearly, you'll recognise it everywhere.`,
              code: `def two_sum(nums, target):
    seen = {}   # value -> index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i   # store AFTER lookup to avoid self-match
    return []

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
print(two_sum([3, 2, 4], 6))        # [1, 2]
print(two_sum([3, 3], 6))           # [0, 1]  ← duplicate handled correctly

# Variant: return all pairs (not just first)
def all_pairs_sum(nums, target):
    seen = {}
    result = []
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            result.append([seen[comp], i])
        seen[n] = i
    return result

print(all_pairs_sum([1, 2, 3, 4, 5], 6))   # [[1,3], [0,4]]`
            },
            {
              title: "Frequency map pattern",
              body: `The frequency map is the second most common hashmap pattern. You count occurrences in one pass, then answer queries in O(1). This solves: anagram problems, finding duplicates, majority element, top-k frequent, and any "how many times does X appear?" question.

The key insight for anagram problems: two strings are anagrams if and only if they have identical character frequency maps. Counter(s) == Counter(t) does this in one line.

Group-by with defaultdict(list): sort all elements by a canonical key (e.g., sorted characters for anagrams), then group strings that share the same key. This is the "classify by some transformation" pattern and appears constantly.

Counter arithmetic is powerful: c1 - c2 gives you elements in c1 that aren't fully covered by c2. c1 & c2 is the minimum frequency for each element. These operations are useful in problems like "find the minimum window" or "check if s can be built from t's characters."`,
              code: `from collections import Counter, defaultdict

# Valid anagram — O(n) time, O(1) space (26 letters)
def is_anagram(s, t):
    return Counter(s) == Counter(t)

print(is_anagram("anagram", "nagaram"))  # True
print(is_anagram("rat", "car"))          # False

# Group anagrams — O(n * k log k) where k = max word length
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))   # canonical form
        groups[key].append(s)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))

# Top K frequent elements — O(n log k) with heap
import heapq
def top_k_frequent(nums, k):
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)

print(top_k_frequent([1,1,1,2,2,3], 2))   # [1, 2]

# Counter arithmetic
c1 = Counter("aabbc")
c2 = Counter("abc")
print(c1 - c2)   # Counter({'a':1, 'b':1})  ← what's left after removing c2`
            },
            {
              title: "Prefix sum + hashmap",
              body: `The prefix sum + hashmap pattern solves "subarray with sum k" in O(n). This is a medium-level pattern that appears constantly and separates candidates who really understand hash maps from those who just memorise Two Sum.

The key idea: define prefix[i] = sum of nums[0..i]. A subarray nums[j..i] has sum = prefix[i] - prefix[j-1]. You want this to equal k, so you need prefix[j-1] = prefix[i] - k. As you scan, you ask "have I seen a prefix sum of (current_prefix - k) before?" If yes, the subarray between that earlier position and now sums to k.

You initialise seen = {0: 1} because an empty prefix (before index 0) has sum 0 — this handles subarrays that start at index 0.

The generalisation: this works for any "range query on a running aggregate." Subarrays with XOR = k uses the same structure with XOR instead of sum.

Longest subarray with sum = k (return length, not count): store seen = {prefix: first_index_seen} and track max length. This variant requires storing the first occurrence, not a count.`,
              code: `# Count subarrays with sum = k — O(n) time, O(n) space
def subarray_sum(nums, k):
    count = 0
    prefix = 0
    seen = {0: 1}   # prefix_sum -> frequency

    for n in nums:
        prefix += n
        count += seen.get(prefix - k, 0)   # "have I seen prefix-k before?"
        seen[prefix] = seen.get(prefix, 0) + 1

    return count

print(subarray_sum([1, 1, 1], 2))    # 2 — [1,1] at [0,1] and [1,2]
print(subarray_sum([1, 2, 3], 3))    # 2 — [3] at [2] and [1,2] at [0,1]

# Longest subarray with sum = k (return length)
def longest_subarray_sum(nums, k):
    first_seen = {0: -1}   # prefix_sum -> earliest index
    prefix = 0
    max_len = 0

    for i, n in enumerate(nums):
        prefix += n
        if prefix - k in first_seen:
            max_len = max(max_len, i - first_seen[prefix - k])
        if prefix not in first_seen:   # store FIRST occurrence only
            first_seen[prefix] = i

    return max_len

print(longest_subarray_sum([1, -1, 5, -2, 3], 3))   # 4`
            },
            {
              title: "Sliding window + frequency map",
              body: `Many sliding window problems need you to track character or element frequencies inside the window. The frequency map acts as the "validity check" — the window is valid when the frequencies satisfy some constraint.

The minimum window substring problem is the canonical example: find the smallest substring of s that contains all characters of t. You expand the right pointer to add characters, and shrink the left pointer once you've satisfied the constraint.

The "have I satisfied the constraint?" check should be O(1). Don't re-scan the frequency map on every step. Instead, maintain a counter of "how many distinct characters have been fully satisfied" and update it incrementally as you add/remove elements.

This pattern generalises to: longest substring with at most k distinct characters, minimum size subarray with sum ≥ target, longest subarray with equal 0s and 1s, and many more. Once you see the template, you can adapt it quickly.`,
              code: `from collections import Counter

# Minimum window substring — O(n + m)
def min_window(s, t):
    if not t or not s:
        return ""

    need = Counter(t)       # how many of each char we need
    have = {}               # how many of each char in window
    formed = 0              # how many chars fully satisfied
    required = len(need)    # distinct chars we need to satisfy

    l = 0
    best = (float("inf"), 0, 0)   # (length, left, right)

    for r, ch in enumerate(s):
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            formed += 1   # just satisfied this character

        while formed == required:   # window is valid — try to shrink
            if r - l + 1 < best[0]:
                best = (r - l + 1, l, r)
            left_ch = s[l]
            have[left_ch] -= 1
            if left_ch in need and have[left_ch] < need[left_ch]:
                formed -= 1   # no longer satisfied
            l += 1

    return s[best[1]:best[2]+1] if best[0] != float("inf") else ""

print(min_window("ADOBECODEBANC", "ABC"))   # "BANC"
print(min_window("a", "a"))                  # "a"`
            },
            {
              title: "Hashmap design patterns — the full toolkit",
              body: `Beyond individual problems, hashmap problems follow a small set of design patterns. Recognise the pattern first, then write the solution.

Pattern 1 — "Complement lookup": store what you've seen, look up what you need. (Two Sum, Two Sum variants)

Pattern 2 — "Frequency counting": count occurrences, then query. (Anagram, Top-K, Majority Element)

Pattern 3 — "Running aggregate + hashmap": store running sum/XOR/product, ask what earlier value would complete the equation. (Subarray Sum = K, Subarray XOR = K)

Pattern 4 — "Group by canonical form": transform each element to its "canonical" key, group all elements with the same key. (Group Anagrams, Sort Characters by Frequency)

Pattern 5 — "First/last occurrence": store the first index where you see a value, use it to compute lengths. (Longest Subarray, First Duplicate)

When you see a new hashmap problem, ask: which of these 5 patterns does it fit? That question usually leads directly to the solution.`,
              code: `# Pattern 5: First/last occurrence — O(n)
def longest_subarray_equal_01(nums):
    """Longest subarray with equal 0s and 1s"""
    # Replace 0s with -1s, then problem becomes: longest subarray with sum 0
    first_seen = {0: -1}
    prefix = 0
    max_len = 0
    for i, n in enumerate(nums):
        prefix += 1 if n == 1 else -1
        if prefix in first_seen:
            max_len = max(max_len, i - first_seen[prefix])
        else:
            first_seen[prefix] = i
    return max_len

print(longest_subarray_equal_01([0,1,0,1,1,0]))   # 6

# Pattern 4: Group by canonical key
def find_duplicate_files(paths):
    """Given file contents, group files by content"""
    groups = defaultdict(list)
    for path, content in paths:
        groups[content].append(path)
    return [v for v in groups.values() if len(v) > 1]

from collections import defaultdict
files = [("a.txt", "hello"), ("b.txt", "world"), ("c.txt", "hello")]
print(find_duplicate_files(files))   # [['a.txt', 'c.txt']]`
            }
          ],
          quiz: [
            {
              q: "In the Two Sum hashmap solution, what does the dict map?",
              options: ["index → value", "value → index", "value → complement", "index → complement"],
              answer: 1,
              explain: "You store value → index so when you encounter a new number, you look up its complement. The lookup key is the value you're searching for. Storing index → value would require scanning all values to find the complement — O(n) per step."
            },
            {
              q: "In prefix sum + hashmap, why initialise seen = {0: 1}?",
              options: ["Avoid division by zero", "Handle subarrays that start at index 0", "It doesn't matter — just convention", "Handle negative numbers"],
              answer: 1,
              explain: "The prefix sum before any elements is 0. If a subarray starting at index 0 has sum k, then prefix[i] = k and you need prefix[i] - k = 0 to be in seen. Without {0: 1}, you'd miss all subarrays that start at the beginning."
            },
            {
              q: "What is the time complexity of the hashmap Two Sum vs brute force?",
              options: ["Both O(n)", "Hashmap O(n), Brute force O(n²)", "Both O(n²)", "Hashmap O(n log n), Brute force O(n²)"],
              answer: 1,
              explain: "Brute force checks every pair: O(n²). Hashmap scans once with O(1) lookups per element: O(n) total. This is the classic space-time trade-off — O(n) extra space buys us O(n) time."
            }
          ],
          starter: `# Challenge: find all pairs that sum to target
# Return list of [i, j] pairs (all of them, not just first)
def all_pairs_sum(nums, target):
    # Hint: use a dict to store seen values -> their indices
    pass

print(all_pairs_sum([1, 2, 3, 4, 5], 6))
# Expected: [[1,3], [0,4]] — indices where 2+4=6, 1+5=6`
        },
        {
          id: "two-pointers",
          title: "Two Pointers",
          tag: "core pattern",
          summary: "Two indices moving through an array simultaneously. Turns O(n²) brute force into O(n).",
          concepts: [
            {
              title: "Opposite ends pattern",
              body: `Start one pointer at the left end, one at the right. Move them toward each other based on a condition. The critical requirement: the array must be sorted. Sorted order is what gives you decision power — if the sum is too small, you know moving the left pointer right will increase it; if too large, moving the right pointer left will decrease it. Without sorting, you have no such guarantee.

The decision rule is always derived from the problem's constraint:
— Sum too small → move left pointer right (increase value)
— Sum too large → move right pointer left (decrease value)
— Found target → record and move both (or just return)

This same structure handles: Two Sum II, three-sum (sort + two inner pointers), container with most water, trapping rainwater, and palindrome checks. The outer structure is always the same while loop — what changes is only the decision condition inside.

Palindrome checking is a natural fit: compare characters at both ends moving inward. No sorting required because we're not making sum-based decisions — we're just comparing symmetric positions.`,
              code: `# Two Sum II — sorted array, O(n) time O(1) space
def two_sum_sorted(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:   return [l+1, r+1]
        elif s < target:  l += 1   # need bigger
        else:             r -= 1   # need smaller
    return []

print(two_sum_sorted([2, 7, 11, 15], 9))   # [1, 2]

# Container with most water — classic opposite-ends
def max_area(height):
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        best = max(best, area)
        if height[l] < height[r]:   # move the shorter side — it can only get shorter staying
            l += 1
        else:
            r -= 1
    return best

print(max_area([1,8,6,2,5,4,8,3,7]))   # 49

# Valid palindrome — no sorting needed, just symmetric comparison
def is_palindrome(s):
    filtered = [c.lower() for c in s if c.isalnum()]
    l, r = 0, len(filtered) - 1
    while l < r:
        if filtered[l] != filtered[r]:
            return False
        l += 1; r -= 1
    return True

print(is_palindrome("A man a plan a canal Panama"))  # True`
            },
            {
              title: "Fast & slow pointer (Floyd's algorithm)",
              body: `One pointer moves 1 step per iteration, the other moves 2. This creates a relative speed difference that solves two important linked list problems: cycle detection and finding the midpoint.

Cycle detection: if there's a cycle, the fast pointer will eventually lap the slow pointer inside the loop — they must meet. If there's no cycle, the fast pointer reaches null. This is Floyd's algorithm, and it uses O(1) space, which is why it beats a visited-set approach.

Finding the midpoint: when fast reaches the end (null or last node), slow is exactly at the midpoint. This is used in merge sort on linked lists and in palindrome linked list checks.

Finding the cycle entry point (a follow-up interviewers love): once slow and fast meet inside the cycle, reset one pointer to head. Move both one step at a time — they'll meet exactly at the cycle's entry node. The proof involves modular arithmetic: the distance from head to cycle entry equals the distance from meeting point to cycle entry.

Finding nth node from end: move fast n steps ahead, then move both one step at a time. When fast reaches the end, slow is at the nth node from the end.`,
              code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

# Cycle detection — O(n) time, O(1) space
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# Find cycle entry point
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
        if slow is fast:
            slow = head          # reset one pointer to head
            while slow is not fast:
                slow = slow.next
                fast = fast.next
            return slow          # cycle entry node
    return None

# Find midpoint — used in merge sort on linked lists
def find_mid(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow   # slow is at midpoint

# Remove nth node from end — O(n) one pass
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next; fast = fast.next
    slow.next = slow.next.next
    return dummy.next`
            },
            {
              title: "3Sum — reducing k-sum to two pointers",
              body: `3Sum is one of the most frequently asked medium problems. The brute force is O(n³) — check every triple. Two pointers brings it to O(n²), which is optimal for this problem.

The key insight: sort the array, fix one element with an outer loop, then use two pointers on the remaining subarray to find pairs that sum to the negated fixed value. Fixing one element reduces a 3-pointer problem to a 2-pointer problem.

Duplicate handling is the tricky part that interviewers check: after finding a valid triple, skip over duplicate values for both left and right pointers. Also, skip duplicate values for the outer fixed pointer. Without this, you'll return duplicate triplets in sorted input.

This pattern generalises: 4Sum sorts + fixes two elements + two pointers on the rest (O(n³)). k-Sum can be solved recursively: reduce to (k-1)-Sum by fixing one element, until you reach 2-Sum with two pointers.

Important: after sorting, if nums[i] > 0, break — no triple can sum to 0 if the smallest available number is already positive. This early exit is a nice optimisation interviewers notice.`,
              code: `# 3Sum — O(n²) time, O(1) extra space (output space not counted)
def three_sum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if nums[i] > 0:          # optimisation: all remaining are positive
            break
        if i > 0 and nums[i] == nums[i-1]:   # skip outer duplicates
            continue

        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                result.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1   # skip inner dups
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1

    return result

print(three_sum([-1, 0, 1, 2, -1, -4]))
# [[-1,-1,2], [-1,0,1]]

print(three_sum([0, 0, 0, 0]))
# [[0,0,0]]  ← duplicate handling works`
            },
            {
              title: "In-place array manipulation with two pointers",
              body: `A common variant: two pointers moving in the SAME direction (not opposite ends). One pointer (slow/write) tracks where to write the next valid element. The other (fast/read) scans ahead looking for valid elements. This achieves in-place modification in O(n) time, O(1) space.

Remove duplicates from sorted array: slow tracks the last unique position. fast scans forward. When fast finds a new unique value (nums[fast] != nums[slow]), copy it to slow+1 and advance slow.

Remove element: same structure — slow writes valid elements (those not equal to val), fast scans all elements.

Move zeroes: slow tracks the next position for non-zero elements. fast scans for non-zeros and swaps them to the slow position.

This "read pointer / write pointer" mental model is universally applicable. The slow pointer's final position + 1 is always the answer to "how many valid elements are there?"`,
              code: `# Remove duplicates from sorted array — in place, O(n) O(1)
def remove_duplicates(nums):
    if not nums: return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:   # found a new unique value
            slow += 1
            nums[slow] = nums[fast]    # write it to the next slot
    return slow + 1   # length of deduplicated array

nums = [1, 1, 2, 3, 3, 4]
k = remove_duplicates(nums)
print(nums[:k])   # [1, 2, 3, 4]

# Move zeroes to end — keep non-zero order, O(n) O(1)
def move_zeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1

nums = [0, 1, 0, 3, 12]
move_zeroes(nums)
print(nums)   # [1, 3, 12, 0, 0]

# Sort colors (Dutch national flag) — 3-way partition, O(n) O(1)
def sort_colors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1   # don't advance mid — swapped value is unexamined

nums = [2, 0, 2, 1, 1, 0]
sort_colors(nums)
print(nums)   # [0, 0, 1, 1, 2, 2]`
            }
          ],
          quiz: [
            {
              q: "Two pointers (opposite ends) requires the array to be...",
              options: ["Reversed", "Sorted", "Of even length", "Containing unique elements"],
              answer: 1,
              explain: "Sorted order gives you decision power. If the sum is too small, moving the left pointer right increases it. If too large, moving the right pointer left decreases it. Without sorting, you don't know which direction helps."
            },
            {
              q: "In 3Sum, why must you sort the array first?",
              options: ["To avoid duplicates in output only", "To enable two-pointer search on the inner pair — and to skip duplicate outer elements", "To make it run in O(n)", "Sorting is not required"],
              answer: 1,
              explain: "Sorting enables two critical things: (1) the inner two-pointer loop works because the subarray is sorted, and (2) you can skip duplicate values of the outer fixed element by checking nums[i] == nums[i-1], avoiding duplicate triplets in the result."
            },
            {
              q: "Fast & slow pointers detect a cycle because...",
              options: ["Fast always reaches null before slow", "If a cycle exists, fast laps slow and they must eventually meet", "Slow stops at the cycle entry", "They both move at the same speed"],
              answer: 1,
              explain: "Inside a cycle, fast gains one step on slow per iteration. They move in a circle, so fast must eventually catch slow — like two runners on a circular track. If no cycle, fast reaches null and the loop ends."
            }
          ],
          starter: `# Challenge: given a sorted array, remove duplicates IN PLACE
# Return the new length. O(1) extra space.
def remove_duplicates(nums):
    # slow pointer tracks last unique position
    # fast pointer scans ahead for new unique values
    pass

nums = [1, 1, 2, 3, 3, 4]
k = remove_duplicates(nums)
print(nums[:k])   # Expected: [1, 2, 3, 4]`
        },
        {
          id: "sliding-window",
          title: "Sliding Window",
          tag: "core pattern",
          summary: "For problems about contiguous subarrays or substrings. Avoids recomputing from scratch each step.",
          concepts: [
            {
              title: "Fixed-size window",
              body: `The fixed-size window is the simpler variant: the window always has exactly k elements. You slide it one step at a time — add the incoming right element, remove the outgoing left element. Each element is touched exactly twice (once added, once removed), giving O(n) time regardless of k.

The key trick: instead of recomputing the window aggregate from scratch each step (which would be O(n*k)), you maintain it incrementally. This is sometimes called a "rolling" computation.

Fixed-size window problems are identified by phrasing like "subarray of size k", "consecutive k elements", "average of every k-length window." The sliding is always: add nums[i], remove nums[i - k].

Beyond sums, this pattern applies to: maximum in each window (use a deque — covered later), product of window, number of distinct elements in window (use a frequency map), and average of window. The core slide mechanic is identical for all of them — only the aggregate update logic changes.`,
              code: `# Max sum of subarray of size k — O(n)
def max_subarray_k(nums, k):
    window_sum = sum(nums[:k])   # initial window
    max_sum = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i]        # add incoming right element
        window_sum -= nums[i - k]    # remove outgoing left element
        max_sum = max(max_sum, window_sum)

    return max_sum

print(max_subarray_k([2, 1, 5, 1, 3, 2], 3))   # 9  (5+1+3)
print(max_subarray_k([1, 4, 2, 10, 23, 3], 4))  # 39 (4+2+10+23)

# Average of every window of size k
def find_averages(nums, k):
    result = []
    window_sum = sum(nums[:k])
    result.append(window_sum / k)
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        result.append(window_sum / k)
    return result

print(find_averages([1, 3, 2, 6, -1, 4, 1, 8, 2], 5))
# [2.2, 2.8, 2.4, 3.6, 2.8]`
            },
            {
              title: "Variable-size window — the universal template",
              body: `The variable-size window is the most common and most powerful variant. The window size changes dynamically based on whether the current window satisfies a constraint.

The template has two moves: expand right (always) and shrink left (when invalid). You expand right unconditionally on every iteration, adding s[r] to the window. When the window violates the constraint, you shrink from the left until it's valid again — then record the answer.

Why is this O(n)? Each element enters the window once (right pointer moves right over it) and leaves once (left pointer moves right over it). Total work = 2n = O(n). The inner while loop does not make this O(n²) — left never moves left.

The hardest part is defining "valid" efficiently. For the longest substring without repeats, valid = no duplicates in the window — checked with a set. For minimum window substring, valid = frequency map fully satisfied. The template stays the same; only the validity check and its O(1) update logic differ.

Keyword signals for variable-size window: "longest subarray/substring satisfying X", "smallest subarray/substring satisfying X", "minimum length", "maximum length with at most k."`,
              code: `# Longest substring without repeating chars — O(n)
def length_of_longest_substring(s):
    char_set = set()
    l = 0
    max_len = 0

    for r in range(len(s)):
        while s[r] in char_set:   # window invalid — shrink from left
            char_set.remove(s[l])
            l += 1
        char_set.add(s[r])
        max_len = max(max_len, r - l + 1)

    return max_len

print(length_of_longest_substring("abcabcbb"))  # 3
print(length_of_longest_substring("pwwkew"))    # 3
print(length_of_longest_substring("bbbbb"))     # 1

# THE TEMPLATE — commit this to memory:
# l = 0
# for r in range(len(s)):
#     ADD s[r] to window state
#     while window is INVALID:
#         REMOVE s[l] from window state
#         l += 1
#     UPDATE answer using (r - l + 1)  ← current valid window size`
            },
            {
              title: "At-most-K and exactly-K patterns",
              body: `A subtle but important variant: "longest subarray with at most k distinct characters" or "number of subarrays with exactly k odd numbers." These require a slightly different approach.

"At most k distinct" is a natural sliding window: the window is valid while the number of distinct elements is ≤ k. When a new element pushes distinct count above k, shrink from left until you're back to k distinct.

"Exactly k" is trickier — you can't directly shrink to "exactly k." The trick: exactly(k) = atMost(k) − atMost(k−1). This reduces an "exactly" problem to two "at most" problems, each solvable with the standard template. This identity appears in several Leetcode hard problems.

The frequency map approach for "at most k distinct": maintain a dict of element → count inside the window. When dict's length exceeds k, remove elements from the left until len(dict) ≤ k. When a character's count drops to 0, delete it from the dict — this keeps len(dict) as an accurate count of distinct elements.`,
              code: `from collections import defaultdict

# Longest substring with at most k distinct chars — O(n)
def longest_k_distinct(s, k):
    freq = defaultdict(int)
    l = 0
    max_len = 0

    for r in range(len(s)):
        freq[s[r]] += 1

        while len(freq) > k:          # too many distinct chars
            freq[s[l]] -= 1
            if freq[s[l]] == 0:
                del freq[s[l]]        # remove from dict to keep count accurate
            l += 1

        max_len = max(max_len, r - l + 1)

    return max_len

print(longest_k_distinct("eceba", 2))    # 3 ("ece")
print(longest_k_distinct("aa", 1))       # 2

# Subarrays with exactly k distinct integers — O(n)
def subarrays_with_k_distinct(nums, k):
    def at_most(k):
        freq = defaultdict(int)
        l = count = 0
        for r in range(len(nums)):
            if freq[nums[r]] == 0:
                k -= 1
            freq[nums[r]] += 1
            while k < 0:
                freq[nums[l]] -= 1
                if freq[nums[l]] == 0:
                    k += 1
                l += 1
            count += r - l + 1
        return count

    return at_most(k) - at_most(k - 1)   # exactly(k) = atMost(k) - atMost(k-1)

print(subarrays_with_k_distinct([1,2,1,2,3], 2))   # 7`
            },
            {
              title: "Sliding window maximum — monotonic deque",
              body: `Finding the maximum in every sliding window of size k is a classic hard problem. The naive approach — scan the window for max each step — is O(n*k). The optimal solution uses a monotonic deque to achieve O(n).

A monotonic deque maintains elements in decreasing order (for maximum queries). When you add a new element, pop all smaller elements from the back — they can never be the maximum while the new element is in the window (it's both larger and more recent). When elements fall out of the window (their index < left bound), pop them from the front.

After processing each position (once r ≥ k-1), the front of the deque is always the index of the maximum element in the current window.

This is called a monotonic deque because the deque is always in monotonically decreasing order of values. The key invariant: the deque contains indices of potentially useful elements — elements that could become the window maximum as the window slides.

Why this matters in interviews: it's often a follow-up to the fixed-size window question. If you solved max sum in O(n), the interviewer might ask "what about max value?" — and the deque solution is the expected answer.`,
              code: `from collections import deque

# Maximum in every window of size k — O(n)
def max_sliding_window(nums, k):
    dq = deque()   # stores indices, front = max of current window
    result = []

    for i, n in enumerate(nums):
        # Remove indices outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # Maintain decreasing order — pop smaller elements from back
        while dq and nums[dq[-1]] < n:
            dq.pop()

        dq.append(i)

        # Window is full — record the maximum
        if i >= k - 1:
            result.append(nums[dq[0]])   # front is always the max index

    return result

print(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))
# [3, 3, 5, 5, 6, 7]

# Walk through for [1,3,-1,-3,5,3,6,7], k=3:
# i=0: dq=[0]          → window not full yet
# i=1: dq=[1]          → 3>1, pop 0. window not full
# i=2: dq=[1,2]        → -1<3, keep. window full → max=nums[1]=3 ✓
# i=3: dq=[1,2,3]      → -3<-1, keep. max=nums[1]=3 ✓
# i=4: dq=[4]          → 5>all, pop all. max=nums[4]=5 ✓
# i=5: dq=[4,5]        → 3<5, keep. max=nums[4]=5 ✓`
            }
          ],
          quiz: [
            {
              q: "Sliding window is best for problems about...",
              options: ["Finding an element by value", "Optimal contiguous subarray/substring", "Sorting elements", "Tree traversal"],
              answer: 1,
              explain: "Keywords: 'contiguous', 'substring', 'subarray', 'window of size k', 'longest/shortest sequence satisfying X'. The contiguous constraint is what makes sliding window applicable — you can efficiently add/remove one element at a time."
            },
            {
              q: "Why is the variable-size sliding window O(n) even though there's a while loop inside the for loop?",
              options: ["The while loop runs in O(1) always", "Each element is added once and removed at most once — total 2n operations", "The while loop only runs when the array is sorted", "It's actually O(n²) in the worst case"],
              answer: 1,
              explain: "The left pointer only moves right, never left. Each element enters the window once (right pointer passes over it) and leaves the window at most once (left pointer passes over it). Total operations = 2n = O(n)."
            },
            {
              q: "How do you solve 'number of subarrays with EXACTLY k distinct elements'?",
              options: ["Direct sliding window — shrink when distinct count > k", "atMost(k) − atMost(k−1)", "Sort the array first", "Use a prefix sum"],
              answer: 1,
              explain: "You can't shrink to 'exactly k' — once you satisfy the constraint you might need to both shrink and expand. The trick: exactly(k) = atMost(k) - atMost(k-1). Count subarrays with at most k distinct minus subarrays with at most k-1 distinct."
            }
          ],
          starter: `# Challenge: find the minimum window substring
# Given s and t, find smallest substring of s containing all chars of t
def min_window(s, t):
    # Use a frequency dict for what you need
    # Expand right, shrink left when all chars satisfied
    pass

print(min_window("ADOBECODEBANC", "ABC"))  # "BANC"
print(min_window("a", "a"))               # "a"`
        },
        {
          id: "stack-queue",
          title: "Stack & Queue",
          tag: "core pattern",
          summary: "Stacks for 'last in first out'. Queues for BFS. Knowing when to use each is the skill.",
          concepts: [
            {
              title: "Stack — when and why",
              body: `A stack gives you O(1) push and pop from the same end (the top). Python lists work as stacks out of the box: append() pushes, pop() pops from the top. Never use pop(0) — that's a queue operation and it's O(n) on a list.

The fundamental use case: whenever a problem involves "undo the last thing" or "process things in reverse order of encounter," a stack is the right tool. Matching brackets, function call simulation, expression evaluation, undo history — all stack problems.

The bracket matching pattern is one of the most common easy/medium problems. The insight: when you see a closing bracket, the most recent unmatched opening bracket must correspond to it. "Most recent unmatched" = top of stack. If it doesn't match, the string is invalid.

The "next greater element" family is the second major stack use case. As you scan left to right, you want to know: for each element, what is the next element to its right that is larger? A stack of "unsatisfied" indices lets you answer this efficiently: when you encounter a large element, pop all smaller elements from the stack — for each popped element, you've just found its "next greater."`,
              code: `# Valid parentheses — O(n) time and space
def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}
    for c in s:
        if c in '([{':
            stack.append(c)
        elif not stack or stack[-1] != pairs[c]:
            return False
        else:
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))    # True
print(is_valid("(]"))        # False
print(is_valid("{[()]}"))    # True

# Daily temperatures — next greater element to the right
def daily_temperatures(temps):
    result = [0] * len(temps)
    stack = []   # indices of days waiting for a warmer day

    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            result[j] = i - j   # days until warmer
        stack.append(i)

    return result   # stack still has indices that never found warmer — default 0

print(daily_temperatures([73,74,75,71,69,72,76,73]))
# [1, 1, 4, 2, 1, 1, 0, 0]`
            },
            {
              title: "Queue with deque — BFS",
              body: `collections.deque gives O(1) append and popleft — a true double-ended queue. Never use list.pop(0) as a queue — it's O(n) per operation, making BFS O(n²) instead of O(n).

BFS (Breadth-First Search) is the canonical queue algorithm. It explores nodes level by level, which makes it naturally suited to "shortest path" problems (unweighted graphs), "minimum steps" problems, and level-order tree traversal. DFS uses a stack (or recursion); BFS uses a queue.

The level-by-level BFS pattern: capture len(queue) at the start of each level, then process exactly that many nodes before incrementing the level counter. This is how you track which level you're on without storing level numbers in the queue.

For graphs, always maintain a visited set before enqueueing (not after dequeuing). If you check after dequeue, the same node can be enqueued multiple times, potentially causing O(V + E²) instead of O(V + E). Add to visited when you add to the queue.`,
              code: `from collections import deque

# BFS — shortest path in unweighted graph, O(V + E)
def bfs_shortest_path(graph, start, end):
    visited = {start}
    queue = deque([(start, 0)])   # (node, distance)

    while queue:
        node, dist = queue.popleft()   # O(1) — deque!
        if node == end:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)        # mark BEFORE enqueue
                queue.append((neighbor, dist + 1))
    return -1

graph = {0:[1,2], 1:[3,4], 2:[4], 3:[], 4:[]}
print(bfs_shortest_path(graph, 0, 4))   # 2

# Level-order BFS — process level by level
def level_order(root):
    if not root: return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)       # snapshot size before processing
        level = []
        for _ in range(level_size):   # only process THIS level's nodes
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`
            },
            {
              title: "Priority Queue — heapq",
              body: `Python's heapq module implements a min-heap: the smallest element is always at index 0. Push with heapq.heappush, pop the minimum with heapq.heappop. Both are O(log n).

A heap is the right tool when you repeatedly need the minimum (or maximum) element from a dynamic set — not just once, but as you add/remove elements. Classic problems: find k-th largest element, merge k sorted lists, find median from data stream, task scheduler.

For a max-heap, negate all values: push -x, and when you pop you get -(-x) = x. Python has no built-in max-heap — negation is the standard approach.

heapq.nlargest(k, iterable) and heapq.nsmallest(k, iterable) solve "top-k" problems directly in O(n log k). For k much smaller than n, this is more efficient than sorting O(n log n).

For objects in the heap, use tuples: (priority, item). Python compares tuples lexicographically, so (priority, item) will sort by priority first. If two items have equal priority and item doesn't support comparison, use a tie-breaking counter: (priority, count, item).`,
              code: `import heapq

# Min-heap basics
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 4)
heapq.heappush(heap, 1)
print(heap[0])              # 1 — always the minimum
print(heapq.heappop(heap))  # 1 — removes and returns minimum

# Max-heap via negation
max_heap = []
for n in [3, 1, 4, 1, 5, 9]:
    heapq.heappush(max_heap, -n)
print(-heapq.heappop(max_heap))   # 9 — maximum

# Top-k largest elements — O(n log k)
def top_k_largest(nums, k):
    return heapq.nlargest(k, nums)

# Kth largest — O(n log k) using a size-k min-heap
def kth_largest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)   # keep only the k largest
    return heap[0]   # smallest of the k largest = kth largest

print(kth_largest([3,2,1,5,6,4], 2))   # 5

# Merge k sorted lists — O(n log k)
def merge_k_sorted(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    result = []
    while heap:
        val, list_i, elem_i = heapq.heappop(heap)
        result.append(val)
        if elem_i + 1 < len(lists[list_i]):
            heapq.heappush(heap, (lists[list_i][elem_i+1], list_i, elem_i+1))
    return result

print(merge_k_sorted([[1,4,5],[1,3,4],[2,6]]))   # [1,1,2,3,4,4,5,6]`
            },
            {
              title: "Monotonic stack — next/previous greater/smaller",
              body: `A monotonic stack maintains a stack where elements are always in sorted order (either increasing or decreasing). As you scan left to right, you enforce the order by popping elements that violate it — and the act of popping is when you "answer" questions about those elements.

For "next greater element to the right": maintain a decreasing stack (indices of elements in decreasing order of value). When you encounter an element larger than the stack's top, pop the top — the current element is the "next greater" for that popped element. Keep popping while the condition holds.

For "previous smaller element to the left": maintain an increasing stack. Before adding index i, pop all elements larger than nums[i]. The stack top (after popping) is the "previous smaller."

Largest Rectangle in Histogram is the hardest monotonic stack problem. Maintain an increasing stack of bar indices. When a bar is shorter than the stack top, pop and calculate the area that popped bar could form as the shortest bar in a rectangle. This solves in O(n) versus O(n²) brute force.

The mental model: the stack holds "unresolved" indices — elements that haven't yet found their answer. Each pop resolves one element's answer.`,
              code: `# Next greater element — O(n) with decreasing monotonic stack
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []   # indices, in decreasing order of value

    for i, n in enumerate(nums):
        while stack and nums[stack[-1]] < n:
            j = stack.pop()
            result[j] = n   # n is the next greater for element at j
        stack.append(i)

    return result

print(next_greater([2, 1, 2, 4, 3]))   # [4, 2, 4, -1, -1]

# Previous smaller element — increasing monotonic stack
def prev_smaller(nums):
    result = [-1] * len(nums)
    stack = []

    for i, n in enumerate(nums):
        while stack and nums[stack[-1]] >= n:
            stack.pop()
        result[i] = nums[stack[-1]] if stack else -1
        stack.append(i)

    return result

print(prev_smaller([2, 1, 2, 4, 3]))   # [-1, -1, 1, 2, 2]

# Largest Rectangle in Histogram — O(n)
def largest_rectangle(heights):
    stack = []   # increasing stack of (index, height)
    max_area = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, ht = stack.pop()
            max_area = max(max_area, ht * (i - idx))
            start = idx   # extend back to this index
        stack.append((start, h))
    for idx, ht in stack:
        max_area = max(max_area, ht * (len(heights) - idx))
    return max_area

print(largest_rectangle([2,1,5,6,2,3]))   # 10`
            }
          ],
          quiz: [
            {
              q: "Why is list.pop(0) dangerous in a BFS loop?",
              options: ["It throws IndexError", "It's O(n) — shifts entire list each time, making BFS O(n²)", "It removes the wrong element", "It doesn't work with visited sets"],
              answer: 1,
              explain: "pop(0) shifts every remaining element left: O(n). In BFS visiting n nodes, that's O(n²) total. deque.popleft() is O(1) because deque is a doubly-linked list. This is a classic hidden performance bug that interviewers test for."
            },
            {
              q: "When should you use a heap instead of sorting?",
              options: ["When you need all elements sorted", "When you repeatedly need the min/max from a dynamic set — elements are added/removed over time", "Heaps are always better than sorting", "When the array is already sorted"],
              answer: 1,
              explain: "If you only need the top-k elements once, sorting (O(n log n)) is fine. But if elements are dynamically added/removed and you repeatedly need the minimum or maximum, a heap maintains O(log n) per operation versus O(n log n) to re-sort every time."
            },
            {
              q: "What does the monotonic stack contain at any point during 'next greater element'?",
              options: ["All elements seen so far", "Indices of elements that have NOT yet found their next greater element", "The current maximum", "Elements in sorted order"],
              answer: 1,
              explain: "The stack holds 'unresolved' indices — elements that haven't yet found a larger element to their right. When a new larger element arrives, it 'resolves' all smaller elements on the stack. When the scan ends, anything still on the stack has no next greater element."
            }
          ],
          starter: `# Challenge: implement a queue using only two stacks
class MyQueue:
    def __init__(self):
        self.inbox = []    # for push
        self.outbox = []   # for pop

    def push(self, x):
        pass   # push to inbox

    def pop(self):
        pass   # if outbox empty, transfer all from inbox first

    def peek(self):
        pass

q = MyQueue()
q.push(1); q.push(2); q.push(3)
print(q.pop())   # 1 (FIFO)
print(q.pop())   # 2`
        },
        {
          id: "clean-python",
          title: "Clean Python",
          tag: "polish",
          summary: "What separates a 'it works' answer from a 'hire' answer. Interviewers notice this.",
          concepts: [
            {
              title: "Pythonic idioms",
              body: `These aren't tricks — they're how experienced Python engineers think. Using them naturally signals seniority without saying a word.

enumerate(iterable, start=0) replaces range(len()). It's cleaner and communicates intent: you need both the index and the value. zip() pairs two iterables element-by-element and stops at the shorter one — use zip_longest from itertools if you need to handle unequal lengths.

Tuple unpacking lets you swap in one line (a, b = b, a), unpack function return values cleanly, and destructure loop variables. Extended unpacking with * captures the "rest" as a list: first, *middle, last = [1,2,3,4,5].

sorted() with a key function avoids writing custom comparators. key=lambda x: (x[1], x[0]) sorts by second element first, then first element — useful for coordinate sorting. key=str.lower sorts case-insensitively.

any() and all() short-circuit — they stop as soon as the result is determined. any(x > 5 for x in nums) is more readable than a loop with an early return, and it's lazy (uses a generator internally).`,
              code: `# enumerate — always prefer over range(len())
nums = [10, 20, 30]
for i, val in enumerate(nums):
    print(f"Index {i}: {val}")

# zip — pair two iterables
names = ["Alice", "Bob", "Carol"]
scores = [95, 87, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Tuple swap — no temp variable
a, b = 5, 10
a, b = b, a   # a=10, b=5

# Extended unpacking
first, *middle, last = [1, 2, 3, 4, 5]
print(first, middle, last)   # 1 [2,3,4] 5

# sorted with key — sort by second element descending
pairs = [(1, 3), (2, 1), (3, 2)]
pairs.sort(key=lambda x: -x[1])   # [(1,3),(3,2),(2,1)]

# any / all — short-circuit, lazy
nums = [1, 3, 5, 7, 8]
print(any(x % 2 == 0 for x in nums))    # True — found 8, stops
print(all(x % 2 != 0 for x in nums))    # False — found 8, stops`
            },
            {
              title: "Type hints & clean naming",
              body: `You don't need type hints in interviews, but clear variable names are non-negotiable. Opaque names (d, x, arr2) signal junior thinking. Good names eliminate the need for comments.

The rule: name variables after what they represent, not what type they are. seen_values is better than s. char_frequency is better than d. complement is better than diff.

Type hints make your code self-documenting. In production AI engineering code, they're expected. The main ones: List[int], Dict[str, int], Optional[str] (can be None), Tuple[int, ...], Set[str], Union[int, str].

In Python 3.10+, you can use built-in types directly: list[int], dict[str, int], str | None. The typing module versions still work in older Python.

For interview code, at minimum: use descriptive variable names, name your helper functions clearly, and if you use a dict, name it to convey what it maps (e.g., val_to_index, char_count, node_to_parent). This makes your code readable while you're talking through it.`,
              code: `from typing import List, Dict, Optional, Tuple
from collections import Counter

# Bad — intent completely opaque
def f(a, b):
    d = {}
    for x in a:
        d[x] = d.get(x, 0) + 1
    return d

# Good — reads like documentation
def count_frequencies(nums: List[int]) -> Dict[int, int]:
    return dict(Counter(nums))

# Optional — function may return None
def find_first_duplicate(nums: List[int]) -> Optional[int]:
    seen: set = set()
    for n in nums:
        if n in seen:
            return n
        seen.add(n)
    return None   # explicit None signals "not found"

# Good naming in context
def two_sum(nums: List[int], target: int) -> List[int]:
    val_to_index: Dict[int, int] = {}
    for index, value in enumerate(nums):
        complement = target - value
        if complement in val_to_index:
            return [val_to_index[complement], index]
        val_to_index[value] = index
    return []

print(count_frequencies([1, 2, 2, 3, 3, 3]))
print(find_first_duplicate([1, 2, 3, 2, 1]))`
            },
            {
              title: "Generators for memory efficiency",
              body: `Generators produce values lazily — one at a time, on demand. The key difference from lists: a generator doesn't compute or store all values upfront. Memory usage is O(1) regardless of how many values the generator could produce.

A generator expression (x**2 for x in range(1_000_000)) uses essentially no memory. The equivalent list comprehension [x**2 for x in range(1_000_000)] allocates ~8MB immediately.

Generator functions use yield instead of return. When you call next() on the generator, it runs until the next yield, returns that value, and suspends — preserving all local state. This is the foundation of Python coroutines and async/await.

In production AI engineering, generators are essential for streaming: streaming LLM tokens as they arrive, processing large datasets without loading into RAM, streaming TTS audio chunks. When an interviewer asks "how would you handle a dataset too large for memory?" the answer is generators (or itertools).

itertools provides powerful combinators: chain(), islice(), groupby(), product(), combinations(), permutations(). These compose with generators and are highly Pythonic for interview problems involving sequences.`,
              code: `# Generator expression vs list comprehension
import sys
gen = (x**2 for x in range(1_000_000))   # ~120 bytes
lst = [x**2 for x in range(1_000_000)]    # ~8 MB

print(sys.getsizeof(gen))   # ~120 bytes
print(sys.getsizeof(lst))   # ~8_000_056 bytes

# Generator function — infinite Fibonacci
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
print(first_10)   # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Streaming pipeline — generator chaining
def read_lines(filename):
    with open(filename) as f:
        for line in f:        # reads one line at a time
            yield line.strip()

def filter_nonempty(lines):
    for line in lines:
        if line:
            yield line

# Each generator is lazy — whole pipeline uses O(1) memory
# pipeline = filter_nonempty(read_lines("big_file.txt"))

# itertools examples
import itertools
print(list(itertools.islice(fibonacci(), 8)))   # first 8 fibs
pairs = list(itertools.combinations([1,2,3,4], 2))
print(pairs)   # [(1,2),(1,3),(1,4),(2,3),(2,4),(3,4)]`
            },
            {
              title: "functools, collections & the standard library",
              body: `Senior Python engineers reach for the standard library before writing custom code. Interviewers notice when you know these tools — it signals real-world experience.

functools.lru_cache (or @cache in 3.9+) memoises a function with a single decorator. It's the fastest way to add memoisation for recursive solutions: just add @lru_cache(maxsize=None) above a recursive function and it becomes O(n) instead of O(2ⁿ).

collections.OrderedDict maintains insertion order and supports move_to_end() — useful for implementing LRU Cache (a very common interview problem). Since Python 3.7, regular dicts maintain insertion order too, but OrderedDict.move_to_end() is still the cleanest LRU implementation tool.

collections.namedtuple creates lightweight classes with named fields. Instead of returning a tuple and remembering which index is which, use a namedtuple: Point = namedtuple('Point', ['x', 'y']). Readable, memory-efficient (no __dict__), and indexable.

bisect module provides binary search on sorted lists. bisect_left(a, x) returns the leftmost index where x can be inserted to keep a sorted. This is O(log n) and avoids writing binary search from scratch.`,
              code: `from functools import lru_cache
from collections import OrderedDict, namedtuple
import bisect

# @lru_cache — memoisation with one decorator
@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

print(fib(50))   # instant — O(n) with memoisation, O(2^n) without

# LRU Cache implementation using OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key)
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)   # evict least recently used

# namedtuple — readable lightweight records
Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 4)
print(p.x, p.y)   # 3 4

# bisect — binary search on sorted list
nums = [1, 3, 5, 7, 9, 11]
print(bisect.bisect_left(nums, 7))    # 3 — index of 7
print(bisect.bisect_right(nums, 7))   # 4 — after 7
print(bisect.bisect_left(nums, 6))    # 3 — where 6 would go`
            }
          ],
          quiz: [
            {
              q: "What does `first, *rest = [1, 2, 3, 4]` produce?",
              options: ["first=[1,2,3,4], rest=[]", "first=1, rest=[2,3,4]", "SyntaxError", "first=1, rest=(2,3,4)"],
              answer: 1,
              explain: "The * captures 'the rest' as a list. first=1, rest=[2,3,4]. This is extended unpacking — clean for head/tail patterns without slicing."
            },
            {
              q: "What's the key difference between a list comprehension and a generator expression?",
              options: ["No difference, just syntax", "List builds all values in memory; generator computes lazily one at a time", "Generators are faster for small lists", "List comprehensions support conditions, generators don't"],
              answer: 1,
              explain: "A list comprehension evaluates everything immediately into memory. A generator yields one item at a time — O(1) memory regardless of size. Critical for streaming and large datasets."
            },
            {
              q: "What does @lru_cache do to a recursive Fibonacci function?",
              options: ["Makes it run in parallel", "Caches results so each value is computed once — O(n) instead of O(2ⁿ)", "Converts it to an iterative function", "Has no effect on performance"],
              answer: 1,
              explain: "lru_cache stores the result of each call. fib(40) without cache makes ~2 billion calls. With @lru_cache, each of the 41 unique subproblems is computed once — O(n) total. This is memoisation with zero code change."
            }
          ],
          starter: `# Make this code more Pythonic — rewrite it cleanly
def process_data(items):
    result = []
    index = 0
    while index < len(items):
        item = items[index]
        if item % 2 == 0:
            result.append(item * item)
        index = index + 1
    return result

# Clean version using list comprehension:
def process_data_clean(items):
    pass   # one line

data = list(range(10))
print(process_data(data))   # [0, 4, 16, 36, 64]`
        }
        ,{
          id: "trees-graphs",
          title: "Trees & Graphs",
          tag: "core pattern",
          summary: "Trees are the most common non-linear data structure in interviews. Graphs generalise trees. Master DFS and BFS on both.",
          concepts: [
            {
              title: "Binary tree DFS — pre, in, post order",
              body: `A binary tree is a graph with no cycles where each node has at most two children. DFS on a tree visits nodes by going deep before going wide. The three DFS orderings differ only in when you process the current node relative to its children.

Pre-order (root → left → right): process node first, then recurse. Used for copying a tree, serialising a tree, or prefix expression evaluation.

In-order (left → root → right): for a BST, in-order traversal visits nodes in sorted order. This is the most important ordering for BST problems.

Post-order (left → right → root): process children before parent. Used for deleting a tree, computing subtree sizes, or evaluating expression trees bottom-up.

The recursive approach is clean but uses O(h) stack space where h is height. For a balanced tree, h = O(log n). For a skewed tree, h = O(n). Iterative DFS uses an explicit stack and avoids stack overflow on very deep trees.

The height/depth intuition: a tree's maximum depth is one of the most common recursive problems. The answer is always: 1 + max(depth(left), depth(right)). Base case: None returns 0 (or -1 for height). This pattern — "combine results from left and right subtrees" — solves dozens of tree problems.`,
              code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Pre-order: root, left, right
def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# In-order: left, root, right — sorted for BST
def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Post-order: left, right, root
def postorder(root):
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# Max depth — the archetypal tree recursion
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Is balanced? — O(n) check
def is_balanced(root):
    def height(node):
        if not node: return 0
        l, r = height(node.left), height(node.right)
        if l == -1 or r == -1 or abs(l - r) > 1:
            return -1   # signal unbalanced
        return 1 + max(l, r)
    return height(root) != -1

# Build a test tree:   4
#                    /   \\
#                   2     6
#                  / \\
#                 1   3
root = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6))
print("Pre-order: ", preorder(root))    # [4,2,1,3,6]
print("In-order:  ", inorder(root))     # [1,2,3,4,6] — sorted!
print("Max depth: ", max_depth(root))   # 3`
            },
            {
              title: "Level-order BFS & common tree patterns",
              body: `BFS on trees visits all nodes level by level, left to right. It's implemented with a queue and is essential for: level-order traversal, finding minimum depth, right side view, and any problem that requires level-by-level processing.

The level-size snapshot technique: at the start of each level, capture len(queue). Process exactly that many nodes before moving to the next level. This lets you track which level you're on without storing level numbers inside the queue.

Right side view: during level-order traversal, the last node in each level is the rightmost visible node. Process each level and record the last node.

Lowest Common Ancestor (LCA) is a classic tree problem. For a BST: LCA is the first node where p and q go to different subtrees. For a general binary tree: recurse — if you find p in the left subtree and q in the right subtree, the current node is the LCA.

Binary Search Tree properties: for every node, all values in the left subtree are smaller, all values in the right subtree are larger. BST operations (search, insert, delete) are O(h) — O(log n) for balanced, O(n) for skewed. In-order traversal gives sorted order.`,
              code: `from collections import deque

# Level-order BFS — returns list of levels
def level_order(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):   # process exactly this level
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

# Right side view — last node at each level
def right_side_view(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        for i in range(len(queue)):
            node = queue.popleft()
            if i == len(queue):   # last node this level (after popleft)
                result.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
    return result

# Lowest Common Ancestor — general binary tree, O(n)
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root   # p and q are in different subtrees
    return left or right

# BST insert — O(h)
def bst_insert(root, val):
    if not root: return TreeNode(val)
    if val < root.val:
        root.left = bst_insert(root.left, val)
    else:
        root.right = bst_insert(root.right, val)
    return root

root = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6))
print("Level order:", level_order(root))   # [[4],[2,6],[1,3]]`
            },
            {
              title: "Graph BFS & DFS patterns",
              body: `A graph is a set of nodes connected by edges. Trees are special graphs (connected, acyclic). Graphs can be directed or undirected, weighted or unweighted, and may contain cycles.

Graph representation:
— Adjacency list: dict mapping node → list of neighbours. O(V + E) space. Most efficient for sparse graphs (most interview problems).
— Adjacency matrix: 2D array where matrix[i][j] = 1 if edge exists. O(V²) space. Better for dense graphs or when you need O(1) edge existence checks.

DFS on a graph: same as tree DFS but with a visited set to avoid revisiting nodes (and infinite loops in cyclic graphs). Used for: connected components, cycle detection, topological sort, path finding.

BFS on a graph: queue + visited set. Used for: shortest path in unweighted graphs, minimum steps problems, flood fill.

The visited set is critical. Add a node to visited BEFORE enqueuing it (not after dequeuing) — otherwise the same node can be enqueued multiple times, leading to O(E) instead of O(V + E).

Common patterns: number of islands (DFS/BFS flood fill), clone graph (DFS with a clone map), course schedule (topological sort / cycle detection in directed graph), word ladder (BFS on implicit graph).`,
              code: `from collections import deque

# DFS — find all nodes in a connected component
def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

# BFS — shortest path (unweighted)
def bfs_shortest(graph, start, end):
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        node, path = queue.popleft()
        if node == end: return path
        for n in graph.get(node, []):
            if n not in visited:
                visited.add(n)
                queue.append((n, path + [n]))
    return []

# Number of islands — DFS flood fill, O(m*n)
def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'   # mark visited by sinking
        sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                sink(r, c)
                count += 1
    return count

grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]
print("Islands:", num_islands(grid))   # 3`
            },
            {
              title: "Topological sort & cycle detection",
              body: `Topological sort orders the nodes of a directed acyclic graph (DAG) such that for every directed edge u → v, node u comes before v. It's used for task scheduling, build dependencies, course prerequisites.

A topological sort is only possible if the graph has no cycles (it's a DAG). If there's a cycle, no valid ordering exists.

Kahn's algorithm (BFS-based): compute in-degree for every node. Add all nodes with in-degree 0 to a queue. Process the queue: for each node, reduce its neighbours' in-degrees. When a neighbour's in-degree hits 0, add it to the queue. If all nodes are processed, it's a DAG. If the result has fewer nodes than the graph, there's a cycle.

DFS-based topological sort: DFS with three states per node — unvisited, visiting (currently in stack), visited. If you encounter a "visiting" node during DFS, there's a cycle. After fully exploring a node, push it to a stack. Reverse the stack for topological order.

For interviews: Kahn's is usually easier to implement correctly and simultaneously detects cycles. Use it for "course schedule" variants.`,
              code: `from collections import deque, defaultdict

# Kahn's algorithm — O(V + E)
def topological_sort(num_nodes, edges):
    """edges: list of (u, v) meaning u must come before v"""
    graph = defaultdict(list)
    in_degree = [0] * num_nodes

    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    # Start with nodes that have no prerequisites
    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) == num_nodes:
        return order   # valid topological order
    return []          # cycle detected — no valid order

# Course schedule — can you finish all courses?
def can_finish(num_courses, prerequisites):
    order = topological_sort(num_courses, prerequisites)
    return len(order) == num_courses

print(topological_sort(4, [(0,1),(0,2),(1,3),(2,3)]))   # [0,1,2,3] or [0,2,1,3]
print(can_finish(2, [[1,0]]))       # True  — 0 before 1
print(can_finish(2, [[1,0],[0,1]]))  # False — cycle`
            }
          ],
          quiz: [
            {
              q: "For a BST, which DFS traversal visits nodes in sorted order?",
              options: ["Pre-order", "In-order", "Post-order", "Level-order"],
              answer: 1,
              explain: "In-order traversal visits left subtree, then root, then right subtree. For a BST, all values in the left subtree are smaller than root, and all in the right are larger — so in-order always yields ascending sorted order."
            },
            {
              q: "Why must you add a node to 'visited' BEFORE enqueuing it in BFS?",
              options: ["It doesn't matter", "To prevent the same node being enqueued multiple times from different neighbours", "Visited is checked after dequeue", "To maintain level order"],
              answer: 1,
              explain: "If you mark visited after dequeue, multiple neighbours can enqueue the same unvisited node before it's dequeued. In dense graphs this causes O(E) enqueue operations instead of O(V). Mark before enqueue to guarantee each node enters the queue at most once."
            },
            {
              q: "What does Kahn's algorithm return when the graph has a cycle?",
              options: ["It throws an error", "A partial order with fewer nodes than the graph", "An infinite loop", "The cycle itself"],
              answer: 1,
              explain: "If there's a cycle, the nodes in the cycle never reach in-degree 0, so they're never added to the queue. The output will have fewer nodes than total. Check: if len(order) != num_nodes, a cycle exists."
            }
          ],
          starter: `# DFS on a grid — flood fill / number of islands
def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Base case: out of bounds or water
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'   # sink the land to mark visited
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count

grid = [["1","1","0"],["1","0","0"],["0","0","1"]]
print(num_islands(grid))   # 2`
        }
        ,{
          id: "binary-search",
          title: "Binary Search",
          tag: "core pattern",
          summary: "Halves the search space each step. If you can ask 'is the answer in the left half or right half?', binary search applies.",
          concepts: [
            {
              title: "The template that never causes off-by-one errors",
              body: `Binary search is O(log n) — halving the search space each step. But the notorious difficulty is off-by-one errors in the boundary conditions. The standard template eliminates them by using a single consistent form.

The template: lo = 0, hi = len(nums) - 1. Loop while lo <= hi. Mid = lo + (hi - lo) // 2 (avoids integer overflow — not a Python concern but a good habit from C++/Java). If nums[mid] == target, return mid. If nums[mid] < target, lo = mid + 1. If nums[mid] > target, hi = mid - 1.

Why lo + (hi - lo) // 2 instead of (lo + hi) // 2? In Python, integers don't overflow, so both work. But in C++/Java, (lo + hi) can overflow a 32-bit int for large arrays. Using lo + (hi - lo) // 2 is the safe universal form.

When the loop ends without finding target (lo > hi), return -1. The invariant: the target, if it exists, is always in nums[lo..hi]. When lo > hi, the range is empty — target is not present.

Memorise this exact template and you'll never have an off-by-one bug in standard binary search again.`,
              code: `# Standard binary search — O(log n), O(1) space
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2   # safe midpoint

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1   # target must be in right half
        else:
            hi = mid - 1   # target must be in left half

    return -1   # not found

nums = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(nums, 7))    # 3
print(binary_search(nums, 6))    # -1

# Search insert position — where would target go if not found?
def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:   return mid
        elif nums[mid] < target:  lo = mid + 1
        else:                     hi = mid - 1
    return lo   # lo is the insertion point when not found

print(search_insert([1,3,5,6], 5))   # 2
print(search_insert([1,3,5,6], 2))   # 1
print(search_insert([1,3,5,6], 7))   # 4`
            },
            {
              title: "Finding left and right boundaries",
              body: `Many binary search problems don't ask "is target present?" but "find the first/last position of target" or "find the leftmost/rightmost index satisfying a condition." These need boundary-finding variants.

Left boundary (first occurrence): when nums[mid] == target, don't return immediately — record it and keep searching left (hi = mid - 1). This continues halving until the leftmost occurrence is found.

Right boundary (last occurrence): when nums[mid] == target, record it and keep searching right (lo = mid + 1).

The clean alternative: Python's bisect module. bisect_left(a, x) returns the leftmost index where x can be inserted to keep a sorted — equivalently, the index of the first element >= x. bisect_right(a, x) returns the index after the last element == x. Use these instead of writing boundary binary search from scratch.

These boundaries unlock many applications: count occurrences of a value (right - left), find if a value exists in a range, find first element greater than x, find last element less than x.`,
              code: `import bisect

# Find first and last position of target — O(log n)
def search_range(nums, target):
    def find_left():
        lo, hi, result = 0, len(nums)-1, -1
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] == target:
                result = mid; hi = mid - 1   # keep searching left
            elif nums[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return result

    def find_right():
        lo, hi, result = 0, len(nums)-1, -1
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] == target:
                result = mid; lo = mid + 1   # keep searching right
            elif nums[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return result

    return [find_left(), find_right()]

print(search_range([5,7,7,8,8,10], 8))   # [3, 4]
print(search_range([5,7,7,8,8,10], 6))   # [-1, -1]

# bisect — cleaner for boundary searches
nums = [1, 3, 5, 5, 5, 7, 9]
left  = bisect.bisect_left(nums, 5)    # 2 — first index of 5
right = bisect.bisect_right(nums, 5)   # 5 — first index after all 5s
print(f"First: {left}, Last: {right-1}, Count: {right-left}")
# First: 2, Last: 4, Count: 3`
            },
            {
              title: "Binary search on answer space",
              body: `The most powerful binary search application is not searching in an array — it's searching for the answer itself. If the answer is a number in some range [lo, hi] and you can write a function that checks "is X a valid answer?", binary search finds the optimal X in O(log(range) * cost_of_check) time.

This pattern is identified by: "find the minimum/maximum X such that condition(X) is true." If condition(X) is monotonic (if X works, all larger X also work, or vice versa), binary search applies.

Examples:
— "Minimum days to make M bouquets" — binary search on the number of days
— "Koko eating bananas" — binary search on the eating speed
— "Find the smallest divisor given a threshold" — binary search on the divisor
— "Capacity to ship packages in D days" — binary search on the capacity

The template: lo = minimum possible answer, hi = maximum possible answer. Check if mid is feasible. If yes, record and try smaller (hi = mid - 1 for minimum). If no, try larger (lo = mid + 1).

Key insight: you're not searching in the input array at all — you're searching the space of possible answers.`,
              code: `# Koko eating bananas — O(n log m) where m = max pile
def min_eating_speed(piles, h):
    import math

    def can_finish(speed):
        hours = sum(math.ceil(p / speed) for p in piles)
        return hours <= h

    lo, hi = 1, max(piles)
    result = hi

    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if can_finish(mid):
            result = mid     # valid — try slower
            hi = mid - 1
        else:
            lo = mid + 1     # too slow — must eat faster

    return result

print(min_eating_speed([3,6,7,11], 8))   # 4
print(min_eating_speed([30,11,23,4,20], 5))   # 30

# Capacity to ship packages in D days — same pattern
def ship_within_days(weights, days):
    def can_ship(capacity):
        day_count, current = 1, 0
        for w in weights:
            if current + w > capacity:
                day_count += 1; current = 0
            current += w
        return day_count <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_ship(mid): hi = mid
        else:             lo = mid + 1
    return lo

print(ship_within_days([1,2,3,4,5,6,7,8,9,10], 5))   # 15`
            },
            {
              title: "Binary search on rotated arrays & 2D matrices",
              body: `Rotated sorted arrays are a classic binary search variation. The array was sorted, then rotated at some pivot. Binary search still works in O(log n) — you just need to determine which half is sorted, then decide which half to search.

The key insight: in a rotated array, at least one of the two halves around mid is always fully sorted. Check which half is sorted by comparing nums[lo] with nums[mid]. Then check if target lies within the sorted half — if yes, search there; if no, search the other half.

Finding the rotation pivot (minimum element) is a separate but related problem: the pivot is the only element where nums[mid] > nums[mid+1]. Binary search for this inflection point.

Binary search in a 2D matrix where each row is sorted and the first element of each row is greater than the last element of the previous row: treat it as a 1D sorted array of length m*n. Map 1D index to 2D: row = index // n, col = index % n.`,
              code: `# Search in rotated sorted array — O(log n)
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target: return mid

        if nums[lo] <= nums[mid]:   # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1       # target in sorted left half
            else:
                lo = mid + 1       # target in right half
        else:                       # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1       # target in sorted right half
            else:
                hi = mid - 1       # target in left half
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))   # 4
print(search_rotated([4,5,6,7,0,1,2], 3))   # -1

# Search 2D matrix — treat as 1D, O(log(m*n))
def search_matrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = matrix[mid // n][mid % n]   # map 1D index to 2D
        if val == target:   return True
        elif val < target:  lo = mid + 1
        else:               hi = mid - 1
    return False

print(search_matrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3))   # True`
            }
          ],
          quiz: [
            {
              q: "Why write `mid = lo + (hi - lo) // 2` instead of `(lo + hi) // 2`?",
              options: ["It's faster", "Avoids integer overflow in languages with fixed-size integers", "It gives a different result in Python", "It handles negative indices"],
              answer: 1,
              explain: "In Python, integers don't overflow, so both work. But in C++/Java with 32-bit ints, (lo + hi) can overflow for large arrays. lo + (hi - lo) // 2 is the safe universal form — a good habit that interviews reward."
            },
            {
              q: "What is 'binary search on the answer space'?",
              options: ["Searching a sorted answer key", "Binary searching for the optimal value of the answer itself, using a feasibility check function", "Searching two sorted arrays simultaneously", "A divide-and-conquer approach"],
              answer: 1,
              explain: "Instead of searching in an input array, you search the space of possible answers. If you can write a function 'is X a valid answer?' and the validity is monotonic (if X works, all larger X also work), binary search finds the optimal X in O(log(range)) feasibility checks."
            },
            {
              q: "In a rotated sorted array [4,5,6,7,0,1,2], how do you decide which half to search?",
              options: ["Always search the left half", "Check which half is fully sorted, then check if target lies within it", "Compare target with nums[0]", "Binary search doesn't work on rotated arrays"],
              answer: 1,
              explain: "At least one half around mid is always fully sorted in a rotated array. Compare nums[lo] with nums[mid]: if nums[lo] <= nums[mid], the left half is sorted. Check if target is in the sorted range — if yes, search there; if no, search the other half."
            }
          ],
          starter: `# Implement binary search — no library functions
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        # Your logic here
        pass
    return -1

print(binary_search([1,3,5,7,9,11], 7))    # 3
print(binary_search([1,3,5,7,9,11], 4))    # -1

# Bonus: find first position of target in array with duplicates
def find_first(nums, target):
    pass

print(find_first([1,2,2,2,3,4], 2))   # 1`
        },
        {
          id: "dynamic-programming",
          title: "Dynamic Programming",
          tag: "must know",
          summary: "DP is memoised recursion. Every DP problem is a decision tree where you cache results to avoid recomputation. Master the pattern, not the tricks.",
          concepts: [
            {
              title: "The DP mindset — from brute force to optimal",
              body: `Dynamic programming has a reputation for being hard, but the mental model is simple: DP is recursion + caching. Every DP problem starts as a brute-force recursive solution. You identify that it recomputes the same subproblems, then cache results. That's it.

The two styles:
— Top-down (memoisation): write the recursive solution, add a cache dict. Natural to think about, easy to implement. The recursion order handles itself.
— Bottom-up (tabulation): fill a table iteratively from base cases up. More efficient (no recursion stack), often needed for space optimisation.

The four-step process for any DP problem:
1. Define the subproblem: what does dp[i] or dp[i][j] mean? Write it in English before writing code.
2. Identify the recurrence: how does dp[i] relate to smaller subproblems?
3. Identify base cases: what are the smallest valid inputs?
4. Determine the order: bottom-up left-to-right, or top-down with memo?

The hardest part is step 1 — defining what your dp array represents. Once you have a precise definition, the recurrence usually follows naturally.

When to recognise a DP problem: the problem asks for a maximum, minimum, or count of something. You're making a sequence of decisions where each decision affects future options. There's optimal substructure (optimal solution to the whole = optimal solutions to subproblems) and overlapping subproblems (same subproblem computed multiple times in brute force).

Greedy vs DP: greedy makes the locally optimal choice at each step without looking back. DP considers all choices and picks the best. Greedy is faster (O(n) often) but only works when the greedy choice is provably safe. When in doubt, use DP.`,
              code: `# Classic intro: Fibonacci — brute force → memo → tabulation → space-optimal
import time
from functools import lru_cache

# 1. Brute force — exponential O(2^n)
def fib_brute(n):
    if n <= 1: return n
    return fib_brute(n-1) + fib_brute(n-2)

# 2. Top-down memoisation — O(n) time, O(n) space
def fib_memo(n, cache={}):
    if n <= 1: return n
    if n not in cache:
        cache[n] = fib_memo(n-1, cache) + fib_memo(n-2, cache)
    return cache[n]

# 3. Bottom-up tabulation — O(n) time, O(n) space
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# 4. Space-optimised — O(n) time, O(1) space
# Only need last 2 values, not the whole table
def fib_optimal(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

n = 35
t = time.time(); print(f"Brute:   fib({n}) = {fib_brute(n)}, time: {time.time()-t:.3f}s")
t = time.time(); print(f"Memo:    fib({n}) = {fib_memo(n)}, time: {time.time()-t:.3f}s")
t = time.time(); print(f"Tab:     fib({n}) = {fib_tab(n)}, time: {time.time()-t:.3f}s")
t = time.time(); print(f"Optimal: fib({n}) = {fib_optimal(n)}, time: {time.time()-t:.3f}s")`
            },
            {
              title: "1D DP — climbing stairs, house robber, coin change",
              body: `These three problems cover the essential 1D DP patterns. Master them and you can solve most 1D DP problems in interviews.

Climbing stairs (LC 70): you can take 1 or 2 steps. How many ways to reach step n?
— dp[i] = number of ways to reach step i
— Recurrence: dp[i] = dp[i-1] + dp[i-2] (came from i-1 in one step, or i-2 in two steps)
— This is Fibonacci in disguise. Generalises to k steps.

House robber (LC 198): array of house values. Can't rob adjacent houses. Max you can steal?
— dp[i] = max money robbing from houses 0..i
— Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
— Either skip house i (take dp[i-1]) or rob it (take dp[i-2] + nums[i])
— Key insight: at each house you make one binary decision.

Coin change (LC 322): given coin denominations, find fewest coins to make amount.
— dp[i] = fewest coins to make amount i
— Recurrence: dp[i] = min(dp[i - coin] + 1) for each coin ≤ i
— Initialise dp[0] = 0, rest = infinity
— This is the "unbounded knapsack" variant — coins can be reused.

The interview pattern: for any optimisation over 1D sequence, try dp[i] = "best answer considering elements 0..i". Then ask: does element i get included or excluded? The recurrence falls out from that binary choice.`,
              code: `# Three essential 1D DP patterns

def climb_stairs(n):
    """Ways to reach step n taking 1 or 2 steps at a time"""
    if n <= 2: return n
    # dp[i] = ways to reach step i
    # dp[i] = dp[i-1] + dp[i-2]
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

def house_robber(nums):
    """Max value robbing non-adjacent houses"""
    if not nums: return 0
    if len(nums) == 1: return nums[0]
    # dp[i] = max money from houses 0..i
    prev2, prev1 = 0, 0
    for num in nums:
        # Either skip this house (prev1) or rob it (prev2 + num)
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1

def coin_change(coins, amount):
    """Fewest coins to make amount; -1 if impossible"""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                # Use this coin: costs 1 + however many to make (i - coin)
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Test all three
print("Climb stairs:")
for n in [1, 2, 3, 5, 10]:
    print(f"  n={n}: {climb_stairs(n)} ways")

print("\\nHouse robber:")
print(f"  [1,2,3,1] → {house_robber([1,2,3,1])}")   # 4 (rob 1 and 3)
print(f"  [2,7,9,3,1] → {house_robber([2,7,9,3,1])}")  # 12 (rob 2, 9, 1)

print("\\nCoin change:")
print(f"  coins=[1,5,11], amount=15 → {coin_change([1,5,11], 15)} coins")  # 3 (5+5+5)
print(f"  coins=[2], amount=3 → {coin_change([2], 3)}")  # -1 (impossible)`
            },
            {
              title: "2D DP — longest common subsequence and grid problems",
              body: `2D DP uses a table dp[i][j] where i and j index two different dimensions — usually two strings, or a row and a remaining capacity. The logic is the same: define what dp[i][j] means precisely, find the recurrence from smaller subproblems.

Longest Common Subsequence (LCS, LC 1143): given strings s and t, find the length of their longest common subsequence.
— dp[i][j] = length of LCS of s[:i] and t[:j]
— If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] + 1 (characters match, extend LCS)
— Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (skip one character from either string)
— Base case: dp[0][j] = dp[i][0] = 0 (empty string has no common subsequence)

Unique paths (LC 62): m×n grid, can only move right or down. How many paths from top-left to bottom-right?
— dp[i][j] = number of paths to reach cell (i, j)
— Recurrence: dp[i][j] = dp[i-1][j] + dp[i][j-1]
— Base cases: first row and column all 1s (only one way to reach them)

Edit distance (LC 72): fewest insertions/deletions/substitutions to convert s to t.
— dp[i][j] = edit distance between s[:i] and t[:j]
— If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] (no operation needed)
— Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) (delete, insert, replace)

Space optimisation for 2D DP: most 2D DP recurrences only look at the previous row. You can reduce O(m*n) space to O(n) by keeping only two rows (or one row with careful updates).`,
              code: `def lcs(s, t):
    """Longest Common Subsequence length"""
    m, n = len(s), len(t)
    # dp[i][j] = LCS length of s[:i] and t[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

def unique_paths(m, n):
    """Count paths in m x n grid moving only right or down"""
    # dp[i][j] = paths to reach (i, j)
    dp = [[1] * n for _ in range(m)]  # Base: first row+col all 1

    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]

def edit_distance(s, t):
    """Minimum edit operations to convert s to t"""
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: convert s[:i] to empty = i deletions
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1]  # Characters match — free
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete from s
                    dp[i][j-1],    # Insert into s
                    dp[i-1][j-1]   # Replace
                )

    return dp[m][n]

print("LCS:")
print(f"  'abcde' vs 'ace' → {lcs('abcde', 'ace')}")     # 3 (ace)
print(f"  'abc' vs 'abc' → {lcs('abc', 'abc')}")          # 3

print("\\nUnique paths:")
print(f"  3x7 grid → {unique_paths(3, 7)}")  # 28
print(f"  3x3 grid → {unique_paths(3, 3)}")  # 6

print("\\nEdit distance:")
print(f"  'horse' → 'ros' → {edit_distance('horse', 'ros')}")  # 3
print(f"  'abc' → 'abc' → {edit_distance('abc', 'abc')}")      # 0`
            },
            {
              title: "Knapsack patterns — 0/1 and unbounded",
              body: `The knapsack family is the most important DP pattern for interviews beyond strings. Once you see it, you'll recognise it everywhere — partition problems, subset sum, target sum, and more.

0/1 Knapsack: given items with weights and values, and a capacity W, maximise value without exceeding capacity. Each item can be used at most once (0/1).
— dp[i][w] = max value using first i items with capacity w
— For each item i: either skip it (dp[i-1][w]) or include it if it fits (dp[i-1][w-weight[i]] + value[i])
— Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

Space optimisation: iterate capacity in reverse when using a 1D array. This prevents using the same item twice (which would make it unbounded).

Unbounded knapsack: items can be used multiple times. Coin change is this pattern. Iterate capacity forward in the 1D variant.

Subset sum / partition equal subset (LC 416): can you partition an array into two subsets with equal sum?
— Equivalent to: can you find a subset with sum = total/2?
— dp[j] = True if sum j is achievable using available numbers
— This is 0/1 knapsack with boolean values instead of max-value.

The key insight interviewers look for: recognising that "can we achieve target X?" problems are 0/1 knapsack with booleans. Partition, subset sum, and target sum (LC 494) all reduce to this.`,
              code: `def knapsack_01(weights, values, capacity):
    """0/1 knapsack — each item used at most once"""
    n = len(weights)
    # 1D space-optimised version
    dp = [0] * (capacity + 1)

    for i in range(n):
        # REVERSE iteration — prevents using item i more than once
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]

def knapsack_unbounded(weights, values, capacity):
    """Unbounded knapsack — items can be reused"""
    dp = [0] * (capacity + 1)

    for w in range(1, capacity + 1):
        # FORWARD iteration — allows reusing items
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]

def can_partition(nums):
    """LC 416: partition into two equal-sum subsets"""
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j] = can we achieve sum j?
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset sums to 0

    for num in nums:
        for j in range(target, num - 1, -1):  # Reverse = 0/1
            dp[j] = dp[j] or dp[j - num]

    return dp[target]

weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
cap = 8

print(f"0/1 knapsack (cap={cap}): {knapsack_01(weights, values, cap)}")        # 10
print(f"Unbounded knapsack (cap={cap}): {knapsack_unbounded(weights, values, cap)}")

print()
print("Can partition:")
print(f"  [1,5,11,5] → {can_partition([1,5,11,5])}")  # True (1+5+5 = 11)
print(f"  [1,2,3,5] → {can_partition([1,2,3,5])}")    # False
print(f"  [1,1] → {can_partition([1,1])}")             # True`
            }
          ],
          quiz: [
            {
              q: "What are the two conditions that make a problem solvable with dynamic programming?",
              options: ["It must be a graph problem with cycles", "Optimal substructure and overlapping subproblems", "The input must be sorted", "It must involve strings"],
              answer: 1,
              explain: "Optimal substructure means the optimal solution to the whole problem contains optimal solutions to its subproblems. Overlapping subproblems means the same subproblems are solved repeatedly in the naive recursive approach. Both together mean DP gives a correct and efficient solution."
            },
            {
              q: "In the 0/1 knapsack space-optimised solution, why do you iterate the capacity dimension in reverse?",
              options: ["It's faster", "Reverse iteration ensures each item is used at most once — forward iteration would allow the same item to be counted multiple times", "The recurrence requires it", "It reduces memory usage"],
              answer: 1,
              explain: "In the 1D knapsack array, dp[w] is updated using dp[w - weight]. If you go forward, dp[w - weight] has already been updated in this iteration (possibly with the current item), allowing the item to be used again. Reverse iteration ensures you only read values from the previous item's row."
            },
            {
              q: "What is the recurrence for Edit Distance (Levenshtein distance)?",
              options: ["dp[i][j] = dp[i-1][j-1] + 1 always", "If chars match: dp[i][j] = dp[i-1][j-1]; else dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])", "dp[i][j] = max(dp[i-1][j], dp[i][j-1])", "dp[i][j] = dp[i-1][j] + dp[i][j-1]"],
              answer: 1,
              explain: "When characters match, no operation is needed — inherit from the diagonal. When they differ, you pay 1 operation for the best of: delete from s (dp[i-1][j]), insert into s (dp[i][j-1]), or replace (dp[i-1][j-1]). The minimum of these three gives the fewest total edits."
            }
          ],
          starter: `# Practice: solve these DP problems using the pattern
# dp definition → recurrence → base cases → code

# Problem 1: Longest Increasing Subsequence (LC 300)
# dp[i] = length of LIS ending at index i
def length_of_lis(nums):
    if not nums: return 0
    dp = [1] * len(nums)  # Every element is an LIS of length 1 alone
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

print("LIS:", length_of_lis([10,9,2,5,3,7,101,18]))  # 4 → [2,3,7,101]

# Problem 2: Maximum subarray (Kadane's algorithm)
# dp[i] = max subarray sum ending at i
def max_subarray(nums):
    max_ending_here = max_so_far = nums[0]
    for num in nums[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

print("Max subarray:", max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6 → [4,-1,2,1]

# Problem 3: Word break (LC 139) — try implementing this!
# dp[i] = can s[:i] be segmented using words in wordDict?
def word_break(s, word_dict):
    word_set = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # Empty string is always valid
    # YOUR CODE HERE
    # Hint: for each position i, check all j < i where dp[j] is True
    # and s[j:i] is in word_set
    return dp[len(s)]

print("Word break:", word_break("leetcode", ["leet", "code"]))  # True
print("Word break:", word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]))  # False
`
        },
        {
          id: "tries",
          title: "Tries & Union-Find",
          tag: "good to know",
          summary: "Two data structures that unlock O(1) or O(prefix-length) solutions to problems that are O(n) or worse with hashmaps. Both appear in FAANG-level interviews.",
          concepts: [
            {
              title: "Trie — the prefix tree",
              body: `A Trie (pronounced 'try', from re*trie*val) is a tree where each node represents one character, and paths from root to a node spell out a prefix. Every word inserted shares nodes with other words that share the same prefix.

Structure: each node has up to 26 children (for lowercase English) and a boolean is_end flag marking that a complete word ends here. The root is empty.

Why Tries beat hashmaps for prefix problems: a hashmap lookup for 'apple' is O(k) where k = word length, same as a Trie. But hashmaps can't answer prefix queries like "does any word start with 'app'?" efficiently — you'd need O(n*k) to check all words. A Trie answers this in O(k) — just traverse the prefix path and check if the node exists.

Core operations:
— Insert: walk the trie character by character, creating nodes as needed. O(k).
— Search: walk the trie character by character. Return True only if you reach the end and is_end is True. O(k).
— StartsWith: same as search but don't require is_end. O(k).
— Delete: walk to the word, unset is_end. Optionally prune leaf nodes. O(k).

Where Tries appear in interviews:
— Autocomplete / search suggestions (find all words with a given prefix)
— Word search in a grid (trie prunes the search space dramatically)
— Longest common prefix (traverse until trie branches)
— Replace words with root in a sentence (LC 648)
— Design Add and Search Words (LC 211) — with wildcard '.' matching
— Word Search II (LC 212) — the hard version, needs Trie + backtracking`,
              code: `class TrieNode:
    def __init__(self):
        self.children = {}   # char → TrieNode
        self.is_end = False  # True if a word ends here

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True  # Don't check is_end — prefix need not be a complete word

    def words_with_prefix(self, prefix: str) -> list:
        """Return all words that start with prefix — for autocomplete"""
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        # DFS from this node to collect all complete words
        results = []
        self._dfs(node, prefix, results)
        return results

    def _dfs(self, node, current, results):
        if node.is_end:
            results.append(current)
        for ch, child in node.children.items():
            self._dfs(child, current + ch, results)

# Test
trie = Trie()
for word in ["apple", "app", "application", "apply", "apt", "banana"]:
    trie.insert(word)

print("search('app'):", trie.search("app"))          # True
print("search('ap'):", trie.search("ap"))            # False (not inserted)
print("starts_with('ap'):", trie.starts_with("ap"))  # True
print("starts_with('xyz'):", trie.starts_with("xyz"))# False
print()
print("Autocomplete 'app':", trie.words_with_prefix("app"))
print("Autocomplete 'apt':", trie.words_with_prefix("apt"))`
            },
            {
              title: "Union-Find (Disjoint Set Union)",
              body: `Union-Find tracks which elements belong to the same connected component. It supports two operations: union (merge two components) and find (which component does element x belong to?). With optimisations, both run in near-O(1) amortised time.

Two key optimisations that make it fast:
1. Path compression: when you call find(x), make every node on the path point directly to the root. Future finds on those nodes are O(1).
2. Union by rank/size: always attach the smaller tree under the larger tree's root. Without this, the tree can degenerate to a linked list.

Together, the amortised time per operation is O(α(n)) where α is the inverse Ackermann function — effectively O(1) for all practical input sizes.

When to use Union-Find vs BFS/DFS:
— Union-Find: dynamic connectivity queries. Elements are added and unions happen over time. Querying "are x and y connected?" is very fast. Can't reconstruct the path.
— BFS/DFS: static graph, need the actual path, need to detect cycles in directed graphs, or need to process nodes in a specific order. Union-Find can't do directed graphs.

Classic interview problems:
— Number of connected components (LC 323)
— Redundant connection / cycle detection in undirected graph (LC 684)
— Accounts merge (LC 721) — union emails that belong to the same person
— Number of islands — can use UF instead of BFS
— Smallest string with swaps (LC 1202)
— Making a large island (LC 827)`,
              code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))  # Each node is its own parent initially
        self.rank = [0] * n           # Used for union by rank
        self.components = n           # Track number of components

    def find(self, x):
        # Path compression: make every node point directly to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False  # Already in same component
        # Union by rank: attach smaller tree under larger tree
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        self.components -= 1
        return True

    def connected(self, x, y) -> bool:
        return self.find(x) == self.find(y)

# Problem 1: number of connected components
def count_components(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.components

# Problem 2: detect redundant edge (makes a cycle)
def find_redundant_connection(edges):
    n = len(edges)
    uf = UnionFind(n + 1)
    for u, v in edges:
        if not uf.union(u, v):
            return [u, v]  # This edge created a cycle
    return []

# Test
print("Components:")
print(count_components(5, [[0,1],[1,2],[3,4]]))  # 2: {0,1,2} and {3,4}
print(count_components(5, [[0,1],[1,2],[2,3],[3,4]]))  # 1: all connected

print("\\nRedundant connection:")
print(find_redundant_connection([[1,2],[1,3],[2,3]]))  # [2,3]
print(find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]]))  # [1,4]`
            },
            {
              title: "Trie + backtracking — Word Search II",
              body: `Word Search II (LC 212) is the canonical hard problem combining Trie with DFS backtracking. Given a board of characters and a list of words, find all words that exist in the board (connected horizontally/vertically, no cell reused).

Naive approach: for each word, run a DFS from every cell. O(words × rows × cols × 4^maxWordLen). Too slow.

Trie approach: insert all words into a trie. Run DFS from every cell, carrying a trie node pointer. At each step, check if the current character exists in the trie node's children. If not, prune immediately — no word with this prefix exists. If a complete word is found (is_end), add it to results.

This single DFS explores all words simultaneously. The trie prunes paths that can't lead to any word, reducing the search space dramatically.

Key implementation details:
— Mark visited cells by modifying board in-place (set to '#'), restore on backtrack.
— Remove words from the trie after finding them (set is_end = False) to avoid duplicates.
— Prune empty trie nodes after finding a word to speed up future searches.

The pattern generalises: any problem where you need to search for multiple strings in a large space benefits from building a Trie of the targets and searching with backtracking.

Time complexity: O(rows × cols × 4 × 3^(L-1)) where L is the max word length, times the trie depth traversal. The trie pruning makes this fast in practice.`,
              code: `def find_words(board, words):
    """Word Search II — Trie + DFS backtracking"""
    # Build trie of all target words
    trie = {}
    for word in words:
        node = trie
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = word  # Store word at terminal node

    rows, cols = len(board), len(board[0])
    results = []

    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node:
            return  # Prune: no word with this prefix

        next_node = node[ch]

        if '#' in next_node:
            results.append(next_node['#'])
            del next_node['#']  # Remove to avoid duplicates

        board[r][c] = '#'  # Mark visited
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        board[r][c] = ch  # Restore

        # Prune empty trie nodes (optional but speeds up further searches)
        if not next_node:
            del node[ch]

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)

    return results

board = [
    ['o','a','a','n'],
    ['e','t','a','e'],
    ['i','h','k','r'],
    ['i','f','l','v']
]
words = ["oath","pea","eat","rain"]
print("Found:", sorted(find_words(board, words)))  # ['eat', 'oath']

board2 = [['a','b'],['c','d']]
words2 = ["abdc","abcd","db","aa"]
print("Found:", sorted(find_words(board2, words2)))  # ['abdc', 'db']`
            }
          ],
          quiz: [
            {
              q: "Why is a Trie better than a hashset for autocomplete (find all words with prefix 'app')?",
              options: ["Tries use less memory", "A Trie answers prefix queries in O(prefix length) by traversing the tree; a hashset requires checking every stored word", "Tries are always faster for all lookups", "Hashmaps can't store strings"],
              answer: 1,
              explain: "A hashset lookup for exact match is O(k). But to find all words with a given prefix, you'd need to iterate all n stored words and check each — O(n*k). A Trie traverses the prefix path in O(k) and then DFS collects all matching words — much faster when the dictionary is large."
            },
            {
              q: "What two optimisations make Union-Find near O(1) per operation?",
              options: ["Sorting and binary search", "Path compression (every node points directly to root after find) and union by rank (attach smaller tree under larger)", "Memoisation and tabulation", "BFS and DFS"],
              answer: 1,
              explain: "Path compression flattens the tree during find operations so future finds are O(1). Union by rank prevents the tree from degenerating into a linked list. Together they give O(α(n)) amortised — effectively constant time. Without these, Union-Find degrades to O(n) per operation."
            },
            {
              q: "In Word Search II, why do we build a Trie of the target words instead of searching for each word separately?",
              options: ["Trie uses less memory than a list", "A single DFS with a Trie node pointer searches all words simultaneously and prunes paths that match no word prefix", "BFS doesn't work on 2D grids", "The board letters must be sorted"],
              answer: 1,
              explain: "Searching each word independently runs DFS once per word — O(words × cells × 4^L). A Trie lets a single DFS explore all words at once. At each cell, if the character isn't in the current trie node's children, the entire DFS branch is pruned — no word exists with this path as a prefix."
            }
          ],
          starter: `# Implement a Trie that supports wildcard search
# '.' matches any single character (like LC 211 — Design Add and Search Words)

class WildcardTrie:
    def __init__(self):
        self.root = {}

    def add_word(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = True

    def search(self, word: str) -> bool:
        """Return True if word exists; '.' matches any character"""
        return self._dfs(word, 0, self.root)

    def _dfs(self, word, i, node):
        if i == len(word):
            return '#' in node
        ch = word[i]
        if ch == '.':
            # Try all children
            for child in node:
                if child != '#' and self._dfs(word, i + 1, node[child]):
                    return True
            return False
        else:
            if ch not in node:
                return False
            return self._dfs(word, i + 1, node[ch])

# Test
wt = WildcardTrie()
for w in ["bad", "dad", "mad", "pad"]:
    wt.add_word(w)

print(wt.search("pad"))   # True
print(wt.search("bad"))   # True
print(wt.search(".ad"))   # True  — matches bad, dad, mad, pad
print(wt.search("b.."))   # True  — matches bad
print(wt.search("..."))   # True  — matches any 3-letter word
print(wt.search("b.x"))   # False — no match

# Challenge: implement delete(word) — remove a word from the trie
# Hint: use recursion and prune nodes that are no longer needed
`
        }
      ]
    },
    {
      id: "llm",
      title: "LLM Fundamentals",
      icon: "◈",
      color: "#93C5FD",
      desc: "The theory behind the tools you use every day",
      lessons: [
        {
          id: "transformers",
          title: "Transformers & Attention",
          tag: "must know",
          summary: "You don't need the math. You need the intuition — well enough to explain it clearly in an interview.",
          concepts: [
            {
              title: "Tokens & embeddings",
              body: `LLMs don't see words — they see tokens. Tokenisation splits text into subword units using algorithms like BPE (Byte Pair Encoding) or WordPiece. A token is roughly 3/4 of a word on average — "unbelievable" might become ["un", "believ", "able"]. The OpenAI rule of thumb: 1000 tokens ≈ 750 words.

Why subwords instead of full words? A pure word vocabulary can't handle typos, rare words, or new words. A pure character vocabulary makes sequences too long. Subwords hit the sweet spot: a vocabulary of ~50k tokens can represent virtually any text while keeping sequences manageable.

Each token is converted to an embedding — a dense vector of floating-point numbers (typically 768 to 4096 dimensions depending on model size). These vectors encode semantic meaning: similar words have similar vectors. The famous example: king − man + woman ≈ queen. This isn't hand-coded — it emerges from training on large text corpora.

Context window = the maximum number of tokens the model can process in one forward pass. GPT-4: 128k tokens. Claude 3: 200k tokens. Gemini 1.5: 1M tokens. Everything outside the context window is invisible to the model — there's no memory beyond it unless you explicitly manage it.

Practical implications you'll discuss in interviews: longer prompts cost more (billed per token), have higher latency, and eventually exceed the context limit. Prompt compression and summarisation are active research areas.`,
              code: `# Tokenisation in practice — tiktoken (OpenAI's tokeniser)
# pip install tiktoken

import tiktoken

enc = tiktoken.get_encoding("cl100k_base")   # GPT-4 tokeniser

examples = [
    "Hello",
    "Hello, AI engineer!",
    "unbelievable",
    "AI",
    "artificial intelligence",
]

for text in examples:
    tokens = enc.encode(text)
    print(f"{text!r:30} -> {len(tokens)} token(s): {tokens}")

# Practical cost estimation
def estimate_cost(text, price_per_1k=0.002):
    tokens = len(enc.encode(text))
    cost = tokens / 1000 * price_per_1k
    return tokens, cost

prompt = "You are a helpful assistant. " * 20
tokens, cost = estimate_cost(prompt)
print(f"\\n{tokens} tokens → \${cost:.4f} per call")
print(f"1000 calls/day → \${cost*1000:.2f}/day")`
            },
            {
              title: "Self-attention — Q, K, V explained",
              body: `Attention answers: "when processing this token, which other tokens should I focus on, and how much?"

The mechanism uses three learned linear projections of each token's embedding:
— Q (Query): "what information am I looking for?"
— K (Key): "what information do I contain?"
— V (Value): "what do I actually output if selected?"

Attention score between token i and token j = dot_product(Q_i, K_j) / sqrt(d_k). The division by sqrt(d_k) prevents dot products from growing too large in high dimensions, which would push softmax into saturation (near-zero gradients).

Apply softmax to scores → attention weights (sum to 1.0). Output for token i = weighted sum of all V vectors, weighted by attention scores. Tokens with higher scores contribute more to the output.

In "The cat sat on the mat because it was tired", when processing "it", the attention weights for "cat" will be high and for "mat" lower — the model learns this during training. This is how long-range dependencies are captured.

Self-attention: every token attends to every other token → O(n²) time and memory per layer. This is the fundamental scaling bottleneck. Doubling context length quadruples attention compute. This is why long-context models require significant engineering (Flash Attention, sparse attention, sliding window attention).`,
              code: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    """
    Q: (seq_len, d_k)
    K: (seq_len, d_k)
    V: (seq_len, d_v)
    """
    d_k = Q.shape[-1]

    # Step 1: compute raw attention scores
    scores = Q @ K.T / np.sqrt(d_k)   # (seq_len, seq_len)

    # Step 2: softmax to get weights that sum to 1
    scores_exp = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = scores_exp / scores_exp.sum(axis=-1, keepdims=True)

    # Step 3: weighted sum of values
    output = weights @ V   # (seq_len, d_v)
    return output, weights

# Example: 3 tokens, d_k=4, d_v=4
np.random.seed(42)
seq_len, d_k = 3, 4
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, attn_weights = scaled_dot_product_attention(Q, K, V)
print("Attention weights (each row sums to 1):")
print(np.round(attn_weights, 3))
print("\\nOutput shape:", output.shape)`
            },
            {
              title: "Multi-head attention & the transformer block",
              body: `Single-head attention has one Q, K, V projection — the model learns one "relationship type" at a time. Multi-head attention runs h attention heads in parallel, each with its own Q, K, V projections on a lower-dimensional subspace. The outputs are concatenated and projected back.

Why multiple heads? Different heads learn different types of relationships simultaneously. One head might learn syntactic dependencies (subject-verb agreement), another semantic similarity, another coreference resolution. With 12 heads in GPT-2, each head operates in 64-dimensional space (768 / 12 = 64) — computationally same cost as single-head, but much richer representational capacity.

The full transformer block (one layer):
1. Layer Norm → Multi-Head Attention (self-attention) → residual add
2. Layer Norm → Feed-Forward Network (FFN) → residual add

The FFN is two linear layers with a nonlinearity between them (usually GELU). Its hidden dimension is typically 4x the embedding dimension (e.g., 768 → 3072 → 768 in GPT-2). The FFN is where most of the model's "knowledge storage" happens — roughly 2/3 of total parameters.

Residual connections (add the input back to the output) allow gradients to flow directly through deep networks without vanishing — enabling 96-layer models (GPT-3). Layer Norm stabilises training by normalising activations within each layer.

A modern LLM stacks N identical transformer blocks. GPT-2 small: N=12, d_model=768. GPT-3: N=96, d_model=12288. More layers = more capacity to learn complex relationships.`,
              code: `# Conceptual multi-head attention (simplified, no batching)
import numpy as np

class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.h = num_heads
        self.d_k = d_model // num_heads
        # In practice these are learned weight matrices
        # Here we initialise randomly for illustration
        np.random.seed(0)
        self.W_Q = [np.random.randn(d_model, self.d_k) for _ in range(num_heads)]
        self.W_K = [np.random.randn(d_model, self.d_k) for _ in range(num_heads)]
        self.W_V = [np.random.randn(d_model, self.d_k) for _ in range(num_heads)]
        self.W_O = np.random.randn(d_model, d_model)

    def attention(self, Q, K, V):
        scores = Q @ K.T / np.sqrt(self.d_k)
        exp = np.exp(scores - scores.max(axis=-1, keepdims=True))
        w = exp / exp.sum(axis=-1, keepdims=True)
        return w @ V

    def forward(self, X):
        heads = []
        for i in range(self.h):
            Q = X @ self.W_Q[i]
            K = X @ self.W_K[i]
            V = X @ self.W_V[i]
            heads.append(self.attention(Q, K, V))
        # Concatenate all heads and project
        concat = np.concatenate(heads, axis=-1)
        return concat @ self.W_O

# Transformer block structure (pseudocode):
# x = layer_norm(x)
# x = x + multi_head_attention(x)   # residual connection
# x = layer_norm(x)
# x = x + feed_forward(x)           # residual connection

mha = MultiHeadAttention(d_model=64, num_heads=4)
X = np.random.randn(5, 64)   # 5 tokens, 64-dim embeddings
out = mha.forward(X)
print("Input shape:", X.shape)
print("Output shape:", out.shape)  # same: (5, 64)`
            },
            {
              title: "KV cache & inference optimisation",
              body: `During inference (generating tokens one at a time), the model processes all previous tokens at each step. Without optimisation, this is O(n²) per token, O(n³) for a sequence of length n. The KV cache eliminates most of this redundancy.

KV cache: for each transformer layer, store the Key and Value matrices for all previously seen tokens. When generating the next token, you only compute Q, K, V for the new token, then append the new K and V to the cache. Attention for the new token attends to all cached K/V pairs.

This reduces per-step cost from O(n²) to O(n) — a massive speedup for long sequences. The trade-off: memory. Each token requires storing 2 × num_layers × d_model floats. For GPT-3 (96 layers, d_model=12288), a 2048-token KV cache requires ~19GB. This is why long-context inference requires large GPUs.

Other inference optimisations you should know for interviews:
— Quantisation: reduce weight precision (FP16 → INT8 → INT4). 2x-8x memory reduction with small accuracy loss.
— Batching: process multiple requests simultaneously. Continuous batching (Orca, vLLM) handles variable-length sequences efficiently.
— Speculative decoding: a small draft model proposes k tokens, the large model verifies them all in one forward pass. Speeds up generation 2-4x when the draft model is right.
— Flash Attention: tile-based attention that avoids materialising the full n×n attention matrix, dramatically reducing memory bandwidth.`,
              code: `# KV Cache — conceptual implementation
class TransformerWithKVCache:
    def __init__(self, d_model, num_heads, num_layers):
        self.d_model = d_model
        self.num_heads = num_heads
        self.num_layers = num_layers
        # KV cache: list of (K, V) per layer, grows as tokens are generated
        self.kv_cache = [{"K": None, "V": None} for _ in range(num_layers)]

    def generate_next_token(self, new_token_embedding, layer_idx):
        """Process one new token, reusing cached K/V for previous tokens"""
        # Compute K, V only for the new token
        K_new = new_token_embedding  # simplified
        V_new = new_token_embedding  # simplified

        # Append to cache
        cache = self.kv_cache[layer_idx]
        if cache["K"] is None:
            cache["K"] = K_new
            cache["V"] = V_new
        else:
            import numpy as np
            cache["K"] = np.vstack([cache["K"], K_new])
            cache["V"] = np.vstack([cache["V"], V_new])

        # Attend over ALL past K/V (but only compute Q for new token)
        return cache["K"], cache["V"]

# Memory cost of KV cache (bytes):
def kv_cache_memory(seq_len, num_layers, d_model, dtype_bytes=2):
    # 2 matrices (K and V), num_layers, seq_len tokens, d_model dims
    bytes_total = 2 * num_layers * seq_len * d_model * dtype_bytes
    return bytes_total / (1024**3)   # convert to GB

# GPT-3 scale
print(f"GPT-3 KV cache at 2048 tokens: {kv_cache_memory(2048, 96, 12288):.1f} GB")
print(f"GPT-3 KV cache at 8192 tokens: {kv_cache_memory(8192, 96, 12288):.1f} GB")`
            },
            {
              title: "Sampling: temperature, top-p, top-k, and when to use each",
              body: `After the transformer computes logits (raw scores) for every token in the vocabulary, the sampling strategy determines which token is chosen next. These three parameters directly control output quality, creativity, and determinism.

Temperature scales the logits before softmax. Temperature = 1.0 is the raw distribution. Temperature < 1 sharpens the distribution (likely tokens become even more likely, unlikely tokens become near-zero). Temperature = 0 is greedy — always take the argmax. Temperature > 1 flattens the distribution (more uniform, more random).

Top-k sampling: at each step, only consider the k most probable tokens (throw away the rest), then sample from their renormalised distribution. Prevents the model from ever choosing very unlikely tokens. Typical values: k = 50.

Top-p (nucleus) sampling: include the smallest set of tokens whose cumulative probability exceeds p. E.g., top-p = 0.9 means: sort tokens by probability descending, include tokens until their cumulative probability ≥ 0.9, sample from that set. More adaptive than top-k — on high-confidence steps the nucleus is small; on uncertain steps it's larger.

In practice: use temperature=0 for classification, extraction, structured output (reproducibility matters). Use temperature=0.7, top-p=0.9 for conversational or creative generation. Never use temperature > 1 in production — outputs become incoherent. For your telephony pipeline specifically: call outcome classification → temperature=0. Natural agent responses → temperature=0.6-0.8.`,
              code: `import numpy as np

def softmax(logits, temperature=1.0):
    logits = np.array(logits) / temperature
    logits -= logits.max()   # numerical stability
    exp = np.exp(logits)
    return exp / exp.sum()

# Demonstrate temperature effect on a simple 4-token vocabulary
logits = [3.0, 1.5, 0.5, -0.5]
vocab = ["the", "a", "an", "some"]

for temp in [0.1, 0.5, 1.0, 2.0]:
    probs = softmax(logits, temp)
    print(f"temp={temp}: {dict(zip(vocab, np.round(probs, 3)))}")

# Output shows:
# temp=0.1: {'the': 0.999, 'a': 0.001, 'an': ~0, 'some': ~0}  ← nearly deterministic
# temp=1.0: {'the': 0.718, 'a': 0.215, 'an': 0.059, 'some': 0.022} ← raw distribution
# temp=2.0: {'the': 0.467, 'a': 0.283, 'an': 0.175, 'some': 0.107} ← much more uniform

# Top-p nucleus sampling
def top_p_sample(probs, p=0.9):
    sorted_indices = np.argsort(probs)[::-1]
    sorted_probs = probs[sorted_indices]
    cumsum = np.cumsum(sorted_probs)
    # Keep tokens until cumulative prob >= p
    cutoff = np.searchsorted(cumsum, p) + 1
    nucleus = sorted_indices[:cutoff]
    nucleus_probs = probs[nucleus] / probs[nucleus].sum()
    return np.random.choice(nucleus, p=nucleus_probs)`
            }
          ],
          quiz: [
            {
              q: "What is a token in the context of LLMs?",
              options: ["A complete word, always", "A subword unit — roughly a word or word-piece", "A sentence", "A character"],
              answer: 1,
              explain: "Tokens are subword units produced by algorithms like BPE. 'unbelievable' might be 3 tokens. The rule of thumb: 1000 tokens ≈ 750 words. This is why token count ≠ word count."
            },
            {
              q: "What are Q, K, V in the attention mechanism?",
              options: ["Queue, Key, Value — a caching structure", "Query, Key, Value — learned projections for computing attention weights", "Quantised, Kernel, Vector embeddings", "Quick, Known, Variable tokens"],
              answer: 1,
              explain: "Q (Query) = what this token is looking for. K (Key) = what each token contains. V (Value) = what each token outputs if selected. Attention score = Q·K / sqrt(d_k). Weights = softmax(scores). Output = weighted sum of V. All three are learned linear projections of the same input."
            },
            {
              q: "What does the KV cache do during inference?",
              options: ["Caches the output tokens", "Stores K and V matrices for past tokens so they don't need to be recomputed each step", "Reduces model size", "Speeds up training"],
              answer: 1,
              explain: "Without KV cache, generating each new token recomputes K and V for all previous tokens — O(n²) total. With KV cache, K and V are computed once per token and stored. Each new step only computes Q, K, V for the new token and attends over cached K/V — O(n) per step."
            },
            {
              q: "When should you use temperature=0?",
              options: ["Creative writing tasks", "Classification, extraction, and any task needing reproducible deterministic output", "Conversational responses", "When you want diverse outputs"],
              answer: 1,
              explain: "Temperature=0 is greedy — always picks the most likely token. Use it for classification (call outcome, sentiment), structured extraction (JSON), and any task where you want the same output every time. For natural conversation, use 0.6-0.8."
            }
          ],
          starter: `# Explore tokenisation and cost estimation
def rough_token_count(text):
    return len(text) // 4   # ~1 token per 4 characters

prompts = [
    "Classify the following hotel booking call outcome.",
    "You are a hotel booking assistant. The customer wants to check their reservation.",
    "Answer only with: confirmed, not_found, or no_conversation. Transcript: " + "Hello? " * 50
]

for p in prompts:
    tokens = rough_token_count(p)
    cost_per_call = tokens / 1000 * 0.002
    print(f"~{tokens} tokens | \${cost_per_call:.4f}/call | {p[:50]}...")`
        },
        {
          id: "prompt-engineering",
          title: "Prompt Engineering",
          tag: "must know",
          summary: "You already do this — now learn to explain it with precision and framework.",
          concepts: [
            {
              title: "Zero-shot, few-shot, and chain-of-thought",
              body: `These are the three fundamental prompting techniques. Every other technique is a variation or combination of them.

Zero-shot: just describe the task. No examples. Works well for simple, well-defined tasks that the model has seen similar patterns of in training. Fast to iterate, costs fewest tokens.

Few-shot: provide 2-5 input/output examples before the real question. The model infers the pattern from examples rather than following an explicit description. Often dramatically outperforms zero-shot because you show rather than tell. Critical: choose examples that cover edge cases, not just easy cases. Inconsistent or misleading examples hurt more than no examples.

Chain-of-thought (CoT): append "Let's think step by step" or provide an example that includes reasoning steps. Forces the model to externalise intermediate reasoning. Measurably improves accuracy on arithmetic, logic, and multi-step reasoning. The intuition: the model generates tokens sequentially — producing reasoning tokens gives the model "scratch space" to work through the problem before outputting an answer.

Zero-shot CoT ("Let's think step by step") works surprisingly well. Few-shot CoT (examples with reasoning) works better but costs more tokens. For production: use CoT when accuracy is critical and latency/cost is acceptable. Skip CoT for simple classification where it just adds tokens.`,
              code: `# Zero-shot — simple, fast
prompt_zero = """Classify this review as positive or negative.
Review: 'The room was dirty and the AC was broken.'
Classification:"""

# Few-shot — show examples first
prompt_few = """Classify reviews as positive or negative.

Review: "Amazing stay, staff was incredible" -> positive
Review: "AC was broken, terrible service" -> negative
Review: "Room was small but clean, good location" -> positive
Review: "The room was dirty and the AC was broken." ->"""

# Chain-of-thought — force reasoning
prompt_cot = """Classify this hotel call. Think step by step.

Transcript: Customer asked about reservation TBO-45231. Agent confirmed
the booking for Friday check-in.

Step 1 - What did the customer want?
Step 2 - Was their goal achieved?
Step 3 - Classification:"""

# Zero-shot CoT — surprisingly effective
prompt_zero_cot = """Classify this call outcome.
Transcript: [transcript here]
Let's think step by step:"""

print("Techniques ranked by token cost: zero-shot < few-shot < CoT")`
            },
            {
              title: "System prompts — the foundation of reliable LLM apps",
              body: `The system prompt is the most powerful tool in your prompting toolkit. It sets the model's role, persona, constraints, output format, and behaviour for the entire conversation. In production, most of your prompt engineering effort should go into the system prompt.

Role + persona: telling the model "You are an expert hotel booking agent" activates relevant knowledge and tone. More specific roles outperform generic ones: "You are a helpful assistant" < "You are a concise hotel booking agent who responds in under 3 sentences."

Constraints and guardrails: explicitly list what the model should NOT do. "Do not make up booking details. If you cannot find the reservation, say so." Negative constraints are often more important than positive instructions — they prevent failure modes.

Output format instructions: specify the exact format you expect. "Respond only with a JSON object with keys: outcome, confidence, reason." Or use XML tags to structure different parts. Consistent output format is essential for parsing in production.

Claude-specific: Claude responds well to XML tags for structure and to being told the reasoning before the answer. Claude also follows negative instructions reliably. GPT models respond well to role-playing instructions and numbered lists of rules.

Few-shot examples in the system prompt: putting 2-3 examples in the system prompt (rather than the user turn) is a common production pattern. This caches well (most providers cache the system prompt), reducing latency and cost on repeated calls.`,
              code: `# Production system prompt structure
SYSTEM_PROMPT = """You are a call outcome classifier for a hotel booking platform.

Your task: classify each customer service call into exactly one of these categories:
- reservation_confirmed: customer's booking was verified as active
- reservation_not_found: booking ID not found or no booking exists
- cancellation_request: customer wants to cancel their reservation
- no_meaningful_conversation: call ended without substantive interaction

Rules:
- Respond ONLY with a JSON object. No explanation outside JSON.
- Always include a confidence score (0.0 to 1.0)
- If unsure, set confidence below 0.7

Output format:
{"outcome": "<category>", "confidence": <float>, "reason": "<one sentence>"}

Examples:
Transcript: "Customer asked about TBO-123, agent confirmed check-in Friday" ->
{"outcome": "reservation_confirmed", "confidence": 0.97, "reason": "Agent explicitly confirmed the reservation"}

Transcript: "Hello? Hello? [call ends]" ->
{"outcome": "no_meaningful_conversation", "confidence": 0.99, "reason": "No substantive exchange occurred"}
"""

USER_TEMPLATE = """Classify this call:
<transcript>
{transcript}
</transcript>"""

# Usage
transcript = "Customer called to cancel reservation TBO-789. Agent processed cancellation."
user_msg = USER_TEMPLATE.format(transcript=transcript)
print(SYSTEM_PROMPT[:200] + "...")
print("\\nUser:", user_msg)`
            },
            {
              title: "Structured output & JSON mode",
              body: `Getting reliable structured output from LLMs is one of the most important production engineering skills. Unstructured text is hard to parse; JSON fails silently (malformed JSON crashes your pipeline). Here's how to handle it robustly.

JSON mode (OpenAI): set response_format={"type": "json_object"} and the model is guaranteed to return valid JSON. Always combine with explicit JSON structure instructions in the prompt — JSON mode only guarantees valid JSON, not the right keys.

Function calling / tool use: the most reliable structured output method. Define a JSON schema for the expected output as a "tool." The model fills in the schema rather than generating freeform text. Essentially zero parsing failures.

Robust fallback parser: even with JSON mode, production code needs a fallback. LLM outputs sometimes wrap JSON in markdown code blocks, or add preamble text. A robust parser tries: direct parse → extract from code block → extract any JSON object → return None.

Retry strategy: if the first call returns malformed or unexpected output, retry with the error appended to the prompt: "Your previous response was invalid JSON: [error]. Please respond with valid JSON only." One retry usually fixes it.

Majority voting (your approach): running the same prompt N times and taking the majority is valid for high-stakes classification. It's expensive but effective. Use N=3 for balance; N=5 for critical decisions.`,
              code: `import json, re

def parse_llm_json(text: str):
    """Robustly extract JSON from LLM output — handles common failure modes"""
    # 1. Direct parse (best case)
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # 2. Extract from markdown code block
    match = re.search(r'\`\`\`(?:json)?\s*([\s\S]+?)\`\`\`', text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # 3. Find JSON object anywhere in text
    match = re.search(r'\{[\s\S]+?\}', text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    return None   # signal failure to caller

# Test all failure modes
cases = [
    '{"outcome": "confirmed", "confidence": 0.95}',
    '\`\`\`json\\n{"outcome": "not_found"}\\n\`\`\`',
    'The outcome is: {"outcome": "cancelled"}',
    'Here you go: \`\`\`{"confidence": 0.8}\`\`\`',
    'INVALID JSON {{broken',
]
for case in cases:
    result = parse_llm_json(case)
    print(f"{'OK' if result else 'FAIL'}: {result}")`
            },
            {
              title: "Hallucination — causes, detection, mitigation",
              body: `Hallucination is when the model generates plausible-sounding but factually incorrect content. It's the most important failure mode to understand for AI engineering interviews. Interviewers will ask "how do you handle hallucinations in your pipeline?"

Why do models hallucinate? LLMs learn to produce fluent, contextually appropriate text. They're trained to always generate something — they have no built-in "I don't know" mechanism. When the model doesn't have reliable knowledge for a query, it interpolates from patterns rather than refusing to answer.

Types of hallucination:
— Factual: making up specific details (names, dates, numbers, citations)
— Confabulation: mixing real facts with invented ones
— Self-contradiction: inconsistent facts across a long response
— Prompt-induced: caused by misleading or ambiguous prompts

Mitigation strategies ranked by effectiveness:
1. RAG — give the model the actual facts in the context; tell it to cite sources
2. Constrained output — limit the model to predefined categories (classification can't hallucinate)
3. Grounding instructions — "Only answer from the provided document. If not mentioned, say 'I don't know.'"
4. Self-consistency / majority voting — run N times, take majority (your approach)
5. Post-hoc verification — run a second LLM call to verify the first answer

For your telephony pipeline: call outcome classification is naturally hallucination-resistant because you constrain the output to a fixed set of labels. The risk is misclassification, not hallucination. For free-text responses from the agent, RAG + grounding instructions are the right tools.`,
              code: `# Grounding prompt to reduce hallucination
GROUNDED_PROMPT = """Answer the customer's question using ONLY the information
in the provided knowledge base article. If the answer is not in the article,
say exactly: "I don't have that information. Let me connect you with a human agent."
Do not make up details. Do not extrapolate beyond what is stated.

Knowledge base article:
{article}

Customer question: {question}"""

# Example knowledge base article
article = """
Check-in time: 3:00 PM
Check-out time: 11:00 AM
Early check-in: available from 1 PM for a fee of $25
Late check-out: available until 2 PM for a fee of $30
Pets: not allowed
"""

questions = [
    "What time is check-in?",          # answerable
    "Can I bring my dog?",              # answerable
    "Do you have a pool?",              # NOT in article
    "What is the breakfast menu?",     # NOT in article
]

for q in questions:
    prompt = GROUNDED_PROMPT.format(article=article, question=q)
    print(f"Q: {q}")
    print("(would send to LLM — grounded answer expected)\\n")`
            }
          ],
          quiz: [
            {
              q: "Few-shot prompting means...",
              options: ["Using a small model", "Providing example input/output pairs before your actual question", "Limiting token output", "Using temperature=0"],
              answer: 1,
              explain: "Few-shot shows the model what you want rather than describing it. 2-5 well-chosen examples often dramatically outperform detailed zero-shot instructions. Choose examples that cover edge cases, not just easy cases."
            },
            {
              q: "Chain-of-thought prompting works best for...",
              options: ["Simple classification tasks", "Multi-step reasoning where intermediate steps matter", "Reducing latency", "Generating shorter outputs"],
              answer: 1,
              explain: "CoT forces the model to externalise reasoning before giving an answer — the intermediate tokens act as scratch space. Measurably improves arithmetic, logic, and multi-step tasks. For simple classification, it adds tokens without benefit."
            },
            {
              q: "What is the most reliable way to get structured JSON output from an LLM?",
              options: ["Ask nicely in the prompt", "Function calling / tool use with a defined schema", "JSON mode only", "Post-process the output with regex"],
              answer: 1,
              explain: "Function calling (tool use) has the LLM fill in a JSON schema you define — essentially zero parsing failures. JSON mode guarantees valid JSON but not the right structure. Regex is fragile. Ask nicely works sometimes but fails in production."
            }
          ],
          starter: `# Design a few-shot prompt for call classification
CATEGORIES = [
    "reservation_confirmed",
    "reservation_not_found",
    "cancellation_request",
    "no_meaningful_conversation"
]

transcript = """
Agent: Thank you for calling. How can I help?
Customer: I'd like to check my reservation TBO-45231
Agent: I can see your booking — confirmed for Friday check-in.
Customer: Perfect, thank you!
"""

# Write a system prompt + few-shot examples that would
# reliably classify the above as "reservation_confirmed"
system_prompt = """
[Your system prompt here]
"""

print("Prompt engineering is about constraints + examples + format")`
        }
        ,{
          id: "finetuning-rlhf",
          title: "Fine-tuning & RLHF",
          tag: "must know",
          summary: "When to fine-tune, how it works, and what RLHF actually does. These come up in every senior AI engineer interview.",
          concepts: [
            {
              title: "Fine-tuning vs RAG vs prompting — when to use what",
              body: `This is the most common conceptual question in AI engineering interviews: "You need to adapt a base LLM for a specific task. What's your approach?" The answer depends on what exactly needs to change.

Prompt engineering first: always try this first. It requires no infrastructure, costs nothing, and often gets you 80% of the way there. If the task is well-defined and the base model has the knowledge, prompting is the right answer.

RAG when: the model needs access to private, current, or voluminous knowledge it wasn't trained on. The knowledge changes frequently (can't retrain weekly). You need source citations. The data is too large for context. RAG adds knowledge without changing model behaviour.

Fine-tuning when: you need to change the model's style, tone, or output format in ways prompting can't achieve. You have a very specific narrow task with hundreds or thousands of examples. You need a smaller, faster, cheaper model that matches a larger one on your specific task. You need to remove or add capabilities that prompting can't control.

Fine-tuning does NOT add new knowledge reliably. If you fine-tune on facts the model didn't see in pre-training, it may seem to learn them but will hallucinate related facts. Fine-tuning teaches behaviour, not knowledge. Use RAG for knowledge, fine-tuning for behaviour.

The decision tree: Prompting good enough? → Use prompting. Need external/current knowledge? → RAG. Need behaviour/style change? → Fine-tune. Need both? → Fine-tune + RAG (fine-tune for style, RAG for knowledge).`,
              code: `# Decision framework — not code, but structured thinking

DECISION_FRAMEWORK = """
WHEN TO USE EACH APPROACH
==========================

Prompting (try first, always):
  ✓ Task is well-defined
  ✓ Base model has the knowledge
  ✓ You need quick iteration
  ✗ Needs private data
  ✗ Needs specific style/format the model resists

RAG (adds knowledge):
  ✓ Private or frequently updated data
  ✓ Need source citations
  ✓ Data too large for context window
  ✓ Multiple knowledge domains
  ✗ Needs behaviour/personality change
  ✗ Very low latency requirement

Fine-tuning (changes behaviour):
  ✓ Specific output format/style
  ✓ Task-specific terminology or domain
  ✓ Need smaller/faster model
  ✓ Hundreds+ of training examples available
  ✗ Adding new factual knowledge (use RAG for this)
  ✗ You only have a few examples

Cost comparison:
  Prompting:   $0 upfront, higher per-call cost (large prompts)
  RAG:         Medium infra cost, medium per-call cost
  Fine-tuning: High upfront training cost, lower per-call cost
"""

print(DECISION_FRAMEWORK)`
            },
            {
              title: "Full fine-tuning vs LoRA vs PEFT",
              body: `Full fine-tuning updates all model weights on your task-specific dataset. For GPT-3 (175B parameters), this requires ~350GB of GPU memory just to store gradients — impractical for most teams. It also risks catastrophic forgetting (the model loses general capabilities).

Parameter-Efficient Fine-Tuning (PEFT) is the practical solution. Instead of updating all weights, freeze most of them and add a small number of trainable parameters. The base model is preserved; only the adapters are trained. Dramatically reduces compute and memory requirements.

LoRA (Low-Rank Adaptation) is the dominant PEFT method. The insight: weight changes during fine-tuning are low-rank — they can be approximated by two small matrices. Instead of updating weight matrix W (m×n), add ΔW = A × B where A is (m×r) and B is (r×n), and r << min(m,n). Typical r = 8 or 16. This reduces trainable parameters by 10,000x. At inference, merge A×B back into W — no latency overhead.

QLoRA = LoRA + quantisation. The base model is quantised to 4-bit (reducing memory 8x), then LoRA adapters are trained in 16-bit. Allows fine-tuning 65B parameter models on a single 48GB GPU. This made fine-tuning accessible to smaller teams.

In practice: use LoRA or QLoRA via the HuggingFace PEFT library for almost all fine-tuning tasks. Only use full fine-tuning if you have significant compute budget and need to fundamentally change model behaviour across the board.`,
              code: `# LoRA conceptual implementation
import numpy as np

class LoRALayer:
    """
    Instead of updating W directly, we learn low-rank delta: W' = W + A @ B
    r << d_model, so trainable params = r*(m+n) instead of m*n
    """
    def __init__(self, d_in, d_out, rank=8, alpha=16):
        self.W = np.random.randn(d_in, d_out) * 0.02   # frozen base weights
        self.A = np.random.randn(d_in, rank) * 0.02    # trainable
        self.B = np.zeros((rank, d_out))                # init to zero → ΔW=0 at start
        self.scale = alpha / rank   # scaling factor

    def forward(self, x):
        # Base output + low-rank adaptation
        base = x @ self.W
        lora = x @ self.A @ self.B * self.scale
        return base + lora

    def merge(self):
        """At inference: merge LoRA into W for zero latency overhead"""
        self.W = self.W + self.A @ self.B * self.scale

    @property
    def param_count(self):
        d_in, d_out = self.W.shape
        rank = self.A.shape[1]
        total = d_in * d_out
        lora_params = d_in * rank + rank * d_out
        return total, lora_params, f"{lora_params/total:.2%} of full"

layer = LoRALayer(768, 768, rank=8)
total, lora, pct = layer.param_count
print(f"Full params: {total:,}")
print(f"LoRA params: {lora:,} ({pct})")
# Full: 589,824 | LoRA: 12,288 (2.08%)`
            },
            {
              title: "RLHF — how ChatGPT was actually trained",
              body: `RLHF (Reinforcement Learning from Human Feedback) is the technique that transformed base language models into helpful, safe assistants. It's why ChatGPT feels different from raw GPT-3. Understanding it at a conceptual level is expected in senior AI engineer interviews.

Three stages:

Stage 1 — Supervised Fine-Tuning (SFT): start with a pre-trained base model. Fine-tune it on a dataset of human-written (prompt, ideal response) pairs. This teaches the model the correct format and general helpfulness. Result: an SFT model that tries to be helpful but may still produce harmful or unhelpful outputs.

Stage 2 — Reward Model Training: show human raters multiple responses to the same prompt and ask them to rank them. Train a separate "reward model" to predict human preferences — it outputs a scalar score for any (prompt, response) pair. This bottled human preference into a differentiable function.

Stage 3 — RL Training (PPO): use the reward model as the reward signal to fine-tune the SFT model via PPO (Proximal Policy Optimization). The model generates responses, the reward model scores them, and the model is updated to produce higher-scored responses. A KL-divergence penalty prevents the model from drifting too far from the SFT baseline (which would cause it to "hack" the reward model with gibberish that scores high but isn't actually good).

Constitutional AI (Anthropic's approach for Claude): instead of human labellers ranking every response, use the model itself to critique and revise its outputs against a set of principles ("be helpful, harmless, honest"). Scales better than pure RLHF and doesn't require as much human labelling.`,
              code: `# RLHF pipeline — conceptual pseudocode

RLHF_PIPELINE = """
STAGE 1: Supervised Fine-Tuning (SFT)
======================================
Dataset: {prompt, ideal_response} pairs (written by humans)
Training: standard cross-entropy fine-tuning on base LLM
Result:   model that follows instructions in the right format

STAGE 2: Reward Model Training
================================
Dataset: {prompt, response_A, response_B, human_preference} tuples
Model:   LLM with a scalar head (outputs a single reward score)
Training: train to predict which response humans prefer
Loss:     reward(preferred) - reward(rejected) should be positive

STAGE 3: PPO RL Training
=========================
Actor:    SFT model (being trained)
Critic:   Reward model (frozen after stage 2)

Loop:
  1. Sample prompt from dataset
  2. Actor generates response
  3. Reward model scores the response
  4. PPO updates actor to increase reward
  5. KL penalty: keep actor close to SFT baseline
     (prevents reward hacking)

Key insight: the reward model is a proxy for human preferences.
If it's wrong, the actor learns to game it — "reward hacking."
This is why Constitutional AI and RLAIF are active research areas.
"""

# Constitutional AI (Anthropic) — simplified
def constitutional_ai_step(model, prompt, constitution):
    # Step 1: generate initial response
    response = model.generate(prompt)

    # Step 2: model critiques its own response against principles
    critique_prompt = f"""
    Response: {response}
    Principle: {constitution[0]}
    What's wrong with this response? How could it be improved?
    """
    critique = model.generate(critique_prompt)

    # Step 3: model revises based on critique
    revision_prompt = f"Original: {response}\\nCritique: {critique}\\nRevised response:"
    return model.generate(revision_prompt)

print(RLHF_PIPELINE)`
            },
            {
              title: "Evaluation — how do you know your fine-tuned model is better?",
              body: `Model evaluation is where most teams cut corners and pay for it later. "The fine-tuned model feels better" is not an evaluation strategy. Here's how to do it properly.

Offline evaluation (before deployment): build a held-out test set of (prompt, ideal_response) pairs that are representative of production traffic. Metrics:
— BLEU / ROUGE: measure n-gram overlap with reference answers. Fast to compute, but correlates poorly with actual quality for open-ended generation.
— LLM-as-judge: use a strong model (GPT-4, Claude) to score responses on dimensions like accuracy, helpfulness, safety. Correlates better with human preference. Can be expensive.
— Task-specific metrics: for classification, use accuracy/F1. For code generation, use pass@k (does the code pass test cases). For RAG, use RAGAS metrics.

Online evaluation (after deployment): A/B test with real users. Split traffic between old and new model. Measure: user satisfaction (thumbs up/down), task completion rate, downstream business metrics.

The evals you must run before deploying a fine-tuned model:
1. Performance on your specific task (reason you fine-tuned)
2. Regression on general capabilities (did the model forget things?)
3. Safety evaluation (did fine-tuning introduce harmful behaviour?)
4. Latency and cost (fine-tuned models are often smaller — check this)

The golden rule: never evaluate on data from your training set. This seems obvious but is frequently violated when teams "evaluate on a few examples they looked at while building the dataset."`,
              code: `# Evaluation framework for fine-tuned models
from typing import List, Dict

def evaluate_model(model, test_cases: List[Dict], judge_model=None):
    """
    test_cases: [{"prompt": ..., "ideal": ..., "category": ...}]
    Returns metrics broken down by category
    """
    results = {"overall": [], "by_category": {}}

    for case in test_cases:
        response = model.generate(case["prompt"])
        category = case.get("category", "general")

        # Metric 1: exact match (for classification tasks)
        exact = response.strip().lower() == case["ideal"].strip().lower()

        # Metric 2: LLM-as-judge (for open-ended generation)
        if judge_model:
            judge_prompt = f"""
            Question: {case['prompt']}
            Ideal answer: {case['ideal']}
            Model answer: {response}
            Rate the model answer 1-5 for accuracy. Respond with just the number.
            """
            score = int(judge_model.generate(judge_prompt).strip())
        else:
            score = 5 if exact else 1

        result = {"exact_match": exact, "score": score, "response": response}
        results["overall"].append(result)
        results["by_category"].setdefault(category, []).append(result)

    # Aggregate
    overall_acc = sum(r["exact_match"] for r in results["overall"]) / len(results["overall"])
    avg_score   = sum(r["score"] for r in results["overall"]) / len(results["overall"])

    print(f"Overall accuracy: {overall_acc:.1%}")
    print(f"Average LLM-judge score: {avg_score:.2f}/5")
    for cat, items in results["by_category"].items():
        cat_acc = sum(r["exact_match"] for r in items) / len(items)
        print(f"  {cat}: {cat_acc:.1%} accuracy ({len(items)} examples)")

    return results`
            }
          ],
          quiz: [
            {
              q: "When should you fine-tune instead of using RAG?",
              options: ["When you need access to new factual knowledge", "When you need to change the model's behaviour, style, or output format", "Fine-tuning is always better than RAG", "When you have less than 10 examples"],
              answer: 1,
              explain: "Fine-tuning changes behaviour — style, format, tone, task-specific patterns. RAG adds knowledge. If you need the model to know private data, use RAG. If you need it to respond in a specific way, fine-tune. Fine-tuning does not reliably add new facts."
            },
            {
              q: "What does LoRA do differently from full fine-tuning?",
              options: ["It trains on less data", "It freezes the base model and adds small trainable low-rank matrices — 100-10000x fewer parameters", "It uses a different loss function", "It only trains the final layer"],
              answer: 1,
              explain: "LoRA decomposes weight updates into two small matrices (rank r). Instead of updating all m×n weights, it trains m×r + r×n parameters where r is tiny (8-16). The base model is frozen. At inference, the LoRA matrices can be merged back for zero latency overhead."
            },
            {
              q: "What is the role of the KL divergence penalty in RLHF (PPO stage)?",
              options: ["It speeds up training", "It prevents the model from drifting too far from the SFT baseline — stops reward hacking", "It measures the accuracy of the reward model", "It reduces hallucination"],
              answer: 1,
              explain: "Without a KL penalty, the model being RL-trained will 'hack' the reward model — finding outputs that score high but aren't actually good (like repetitive tokens or gibberish that exploits weaknesses in the reward model). The KL penalty keeps the RL model close to the supervised baseline."
            }
          ],
          starter: `# Explore: when would you fine-tune vs RAG for these scenarios?
scenarios = [
    "Build a customer service bot that knows our product docs (updated weekly)",
    "Make GPT-4 respond only in haiku format",
    "Classify support tickets into 5 categories — you have 10,000 examples",
    "Answer questions about a legal document uploaded by the user",
    "Make the model always respond formally and never use contractions",
    "Give the model knowledge of events after its training cutoff",
]

for i, scenario in enumerate(scenarios, 1):
    print(f"{i}. {scenario}")
    print("   -> Your answer: fine-tune / RAG / prompting? Why?")
    print()`
        },
        {
          id: "inference-infra",
          title: "Inference Infrastructure",
          tag: "senior",
          summary: "How LLMs actually run in production — batching, quantisation, KV cache management, and the tools used at scale.",
          concepts: [
            {
              title: "Why inference is hard — the compute and memory bottleneck",
              body: `Running a large language model is fundamentally different from running a traditional API. The bottleneck is not CPU/compute — it's memory bandwidth. GPUs are fast at matrix multiplication but slow at moving data from HBM (high-bandwidth memory) to compute cores. The larger the model, the more data moves per token, and the slower throughput becomes.

Two phases of inference:
— Prefill: process the entire prompt in one forward pass. Highly parallelisable — all input tokens processed simultaneously. Compute-bound. Fast relative to prompt length.
— Decode: generate one token at a time, autoregressively. Sequential — each token depends on the previous. Memory-bandwidth-bound. This is the slow part.

The arithmetic: a 7B parameter model in float16 requires 14GB just to load the weights. Each forward pass reads every weight at least once. At 1TB/s memory bandwidth (A100), reading 14GB takes ~14ms — capping single-token generation at ~70 tokens/sec per request, ignoring the KV cache.

This is why batching is so important: if you process 8 requests simultaneously, you read the weights once and generate tokens for all 8. The memory bandwidth cost is amortised across the batch. Throughput scales with batch size (up to memory limits); latency stays roughly constant.

The KV cache trade-off: caching K and V matrices from the attention layers avoids recomputing them on every decode step, but consumes memory proportional to (batch size × sequence length × num layers × head dim). For long contexts with large batches, the KV cache can exceed the model weights in size.`,
              code: `# Illustrate the prefill vs decode distinction
import time

def simulate_inference_phases(prompt_tokens: int, output_tokens: int,
                               prefill_ms_per_token: float = 0.5,
                               decode_ms_per_token: float = 20.0):
    """
    Prefill: processes all prompt tokens in parallel (fast)
    Decode: generates one token at a time (slow — memory bandwidth bound)
    """
    # Prefill phase — parallelised, so total time ≈ cost of one pass
    prefill_time = prefill_ms_per_token * prompt_tokens  # Not perfectly linear, but close
    print(f"Prefill: {prompt_tokens} prompt tokens → {prefill_time:.0f}ms")

    # Decode phase — sequential
    decode_time = decode_ms_per_token * output_tokens
    print(f"Decode: {output_tokens} output tokens → {decode_time:.0f}ms ({decode_ms_per_token}ms/token)")

    total = prefill_time + decode_time
    print(f"Total: {total:.0f}ms")
    print(f"Effective throughput: {output_tokens / (total/1000):.1f} tokens/sec (single request)")
    print()

print("=== Short prompt, short output ===")
simulate_inference_phases(prompt_tokens=50, output_tokens=100)

print("=== Long RAG prompt, short output ===")
simulate_inference_phases(prompt_tokens=2000, output_tokens=100)

print("=== Why batching helps ===")
batch_size = 8
decode_ms_per_token_batched = 22.0  # Slightly slower per-token, but shared weight reads
decode_time_batch = (decode_ms_per_token_batched * 100) / batch_size  # Amortised!
print(f"Batched ({batch_size} requests): effective {100 / (decode_time_batch/1000):.0f} tokens/sec per request")
print(f"Total throughput: {batch_size * 100 / (decode_time_batch/1000):.0f} tokens/sec")
print("Batching ~{:.0f}x throughput improvement".format(batch_size * 100 / (decode_time_batch/1000) / (100 / (decode_ms_per_token_batched/1000))))`
            },
            {
              title: "Continuous batching and PagedAttention — how vLLM works",
              body: `The naive batching approach has a critical flaw: requests finish at different times. If you batch 8 requests and 7 finish early, the GPU sits idle waiting for the 8th. Worse, you need to pre-allocate KV cache for the maximum possible sequence length — wasting memory for shorter sequences.

vLLM solves both problems:

Continuous batching (also called iteration-level scheduling): instead of waiting for all requests in a batch to finish, swap in new requests the moment a slot frees up. Every forward pass, the scheduler checks for finished requests and replaces them. This keeps GPU utilisation near 100% at high load.

PagedAttention: borrows the OS virtual memory concept of pages. The KV cache is divided into fixed-size blocks (pages). Each sequence's KV cache is stored in non-contiguous pages, tracked by a block table. Benefits:
— No pre-allocation: pages allocated on demand as sequences grow
— No fragmentation: pages are fixed-size and reusable
— KV cache sharing: if two requests share the same system prompt, their KV cache pages for that prefix can be shared (prefix caching / prompt caching)

The result: vLLM achieves 24x higher throughput than naive HuggingFace inference on the same hardware in the original paper.

Alternatives to vLLM: TensorRT-LLM (NVIDIA, fastest on A100/H100 but complex to set up), TGI (HuggingFace Text Generation Inference, easier to deploy), Ollama (local dev), SGLang (better for complex agentic workflows with multiple LLM calls).

Interview answer pattern: "For production inference I'd use vLLM for its continuous batching and PagedAttention — it's the standard for serving open-source models. For latency-critical, I'd evaluate TensorRT-LLM with quantisation."`,
              code: `# Conceptual model of continuous batching vs static batching
from collections import deque
import random

class Request:
    def __init__(self, id, prompt_len, output_len):
        self.id = id
        self.prompt_len = prompt_len
        self.output_len = output_len
        self.tokens_generated = 0

    def is_done(self):
        return self.tokens_generated >= self.output_len

def static_batching(requests, batch_size=4):
    """Old approach: wait for whole batch to finish"""
    total_steps = 0
    for i in range(0, len(requests), batch_size):
        batch = requests[i:i+batch_size]
        # Must wait for longest request in batch
        max_output = max(r.output_len for r in batch)
        total_steps += max_output
        wasted = sum(max_output - r.output_len for r in batch)
        print(f"Batch {i//batch_size+1}: {len(batch)} requests, {max_output} steps, {wasted} wasted GPU steps")
    return total_steps

def continuous_batching(requests, batch_size=4):
    """vLLM approach: swap in new requests as slots free up"""
    queue = deque(requests)
    active = []
    total_steps = 0
    wasted = 0

    while queue or active:
        # Fill active slots
        while len(active) < batch_size and queue:
            active.append(queue.popleft())

        if not active:
            break

        # One decode step for all active requests
        total_steps += 1
        for req in active:
            req.tokens_generated += 1

        # Remove finished, immediately replaced next iteration
        finished = [r for r in active if r.is_done()]
        active = [r for r in active if not r.is_done()]
        if finished:
            print(f"Step {total_steps}: {len(finished)} request(s) finished, {len(queue)} in queue")

    return total_steps

requests = [Request(i, 50, random.randint(20, 200)) for i in range(12)]
requests2 = [Request(r.id, r.prompt_len, r.output_len) for r in requests]  # copy

print("=== Static batching ===")
s = static_batching(requests)
print(f"Total GPU steps: {s}\\n")

print("=== Continuous batching ===")
c = continuous_batching(requests2)
print(f"Total GPU steps: {c}")
print(f"Efficiency gain: {(s-c)/s*100:.0f}% fewer steps")`
            },
            {
              title: "Quantisation — making models smaller and faster",
              body: `Quantisation reduces the precision of model weights and/or activations from float32/float16 to lower bit-widths (int8, int4, even int2). The goal: smaller models load faster, use less memory, and run faster — at the cost of some accuracy.

Why it works: neural network weights don't need full float32 precision. Research shows that representing weights with 8-bit integers causes negligible quality loss. Going to 4-bit causes small but measurable degradation; 2-bit causes significant degradation.

Key quantisation methods:
— GPTQ: post-training quantisation that minimises weight reconstruction error layer by layer. Asymmetric — different ranges per layer. 4-bit GPTQ on a 7B model = ~4GB, runs on a single 8GB consumer GPU.
— AWQ (Activation-aware Weight Quantisation): identifies important weights based on activation magnitudes and keeps them at higher precision. Better quality than GPTQ at same bit-width.
— GGUF/llama.cpp: the format used by Ollama and llama.cpp. CPU-friendly, supports partial GPU offload. Q4_K_M is the recommended 4-bit variant.
— BitsAndBytes: HuggingFace library for 4-bit (NF4) and 8-bit quantisation. Easiest to use — just pass load_in_4bit=True.

Quantisation arithmetic: a 70B model in float16 = 140GB (needs 2x A100 80GB). In 4-bit = 35GB (fits on 2x RTX 3090, cost ~$3k vs ~$30k). For inference only (not training), 4-bit is almost always worth it.

Quantisation-aware training (QAT) vs post-training quantisation (PTQ): QAT simulates quantisation during training, producing better quality at the cost of training complexity. PTQ is applied after training — simpler but slightly lower quality. For most production use cases, PTQ (GPTQ or AWQ) is sufficient.`,
              code: `# Demonstrate quantisation concepts numerically
import struct

def float32_to_bytes(value):
    return struct.pack('f', value)

def quantise_to_int8(values, symmetric=True):
    """Map float values to int8 range [-128, 127]"""
    max_val = max(abs(v) for v in values)
    scale = max_val / 127.0

    quantised = [round(v / scale) for v in values]
    quantised = [max(-128, min(127, q)) for q in quantised]  # Clamp

    # Dequantise (what happens at inference)
    dequantised = [q * scale for q in quantised]

    return quantised, dequantised, scale

def quantise_to_int4(values):
    """Map float values to int4 range [-8, 7]"""
    max_val = max(abs(v) for v in values)
    scale = max_val / 7.0

    quantised = [round(v / scale) for v in values]
    quantised = [max(-8, min(7, q)) for q in quantised]
    dequantised = [q * scale for q in quantised]

    return quantised, dequantised, scale

# Simulate a small weight tensor
weights = [0.234, -0.891, 0.045, 1.234, -0.562, 0.789, -0.123, 0.456]

print("Original weights (float32, 4 bytes each):")
print([f"{w:.3f}" for w in weights])
print(f"Memory: {len(weights) * 4} bytes")
print()

q8, dq8, s8 = quantise_to_int8(weights)
errors8 = [abs(o - d) for o, d in zip(weights, dq8)]
print(f"Int8 quantised: {q8}")
print(f"Int8 dequantised: {[f'{v:.3f}' for v in dq8]}")
print(f"Max error: {max(errors8):.4f}")
print(f"Memory: {len(q8) * 1} bytes (4x reduction)")
print()

q4, dq4, s4 = quantise_to_int4(weights)
errors4 = [abs(o - d) for o, d in zip(weights, dq4)]
print(f"Int4 quantised: {q4}")
print(f"Int4 dequantised: {[f'{v:.3f}' for v in dq4]}")
print(f"Max error: {max(errors4):.4f}")
print(f"Memory: {len(q4) * 0.5} bytes (8x reduction)")
print()

print("Tradeoff summary:")
print(f"  float32: 100% accuracy, 100% memory")
print(f"  int8:    max error {max(errors8):.4f}, 25% memory")
print(f"  int4:    max error {max(errors4):.4f}, 12.5% memory")`
            },
            {
              title: "Speculative decoding and other latency tricks",
              body: `Speculative decoding is the most impactful recent latency optimisation. The insight: the large model (verifier) is memory-bandwidth-bound, not compute-bound. So you can run a small draft model to generate multiple token candidates, then have the large model verify all of them in a single forward pass (which is fast, since it's parallelised like prefill).

How it works:
1. Draft model (e.g. 1B params) generates k candidate tokens speculatively (fast, cheap)
2. Target model (e.g. 70B) evaluates all k tokens in one parallel pass
3. Accept tokens from the draft that the target agrees with; reject and resample at the first disagreement
4. Repeat

If the draft model has good agreement with the target (high acceptance rate), you get k tokens for roughly the cost of 1 — 2-3x speedup with no quality loss. The acceptance rate depends on how well the draft model approximates the target; a draft that's the same model family works best.

Other latency tricks:

Flash Attention: reorders the attention computation to maximise use of fast SRAM (on-chip memory) vs slow HBM. Makes attention faster and more memory-efficient — now the default in all serious inference frameworks. Critical for long contexts.

Tensor parallelism: split each weight matrix across multiple GPUs. All GPUs work on every token. Reduces per-device memory and latency at the cost of communication overhead. Used when a single model doesn't fit on one GPU.

Pipeline parallelism: assign different layers to different GPUs. GPU 1 runs layers 1-16, GPU 2 runs layers 17-32. High throughput but adds pipeline bubble latency. Better for throughput than latency.

Prefix caching: if many requests share the same system prompt, cache the KV values for that prefix. Subsequent requests skip the prefill cost for the shared prefix. vLLM and most production servers support this. Critical for applications with long system prompts.`,
              code: `# Speculative decoding — acceptance/rejection logic
import random

def target_model_probability(token, context):
    """Stub — real impl runs the large model"""
    # Return P(token | context) — probability target assigns to this token
    probs = {"the": 0.4, "a": 0.2, "is": 0.15, "and": 0.1, "of": 0.08}
    return probs.get(token, 0.02)

def draft_model_probability(token, context):
    """Stub — small, fast model"""
    probs = {"the": 0.35, "a": 0.22, "is": 0.18, "and": 0.12, "of": 0.06}
    return probs.get(token, 0.03)

def speculative_decoding_step(context, k=4):
    """
    1. Draft k tokens with small model
    2. Target verifies all k in one pass
    3. Accept/reject based on probability ratio
    """
    draft_tokens = ["the", "quick", "brown", "fox"][:k]  # Simplified: draft generates k tokens

    accepted = []
    for token in draft_tokens:
        p_target = target_model_probability(token, context)
        p_draft = draft_model_probability(token, context)

        # Acceptance criterion: accept with probability min(1, p_target / p_draft)
        acceptance_prob = min(1.0, p_target / p_draft)
        r = random.random()

        if r < acceptance_prob:
            accepted.append(token)
            print(f"  Token '{token}': p_target={p_target:.2f}, p_draft={p_draft:.2f}, "
                  f"accept_prob={acceptance_prob:.2f} → ACCEPTED")
        else:
            print(f"  Token '{token}': p_target={p_target:.2f}, p_draft={p_draft:.2f}, "
                  f"accept_prob={acceptance_prob:.2f} → REJECTED")
            # Sample a replacement token from target distribution
            accepted.append("fox")  # Simplified
            break

    speedup = len(accepted) / 1.0  # vs generating 1 token normally
    return accepted, speedup

print("Speculative decoding step (k=4 draft tokens):")
tokens, speedup = speculative_decoding_step("Once upon a time", k=4)
print(f"\\nAccepted {len(tokens)} tokens: {tokens}")
print(f"Effective speedup: {speedup:.1f}x (vs 1 token per target model call)")
print()
print("Key insight: target model ran ONE forward pass to verify all 4 candidates")
print("This is as fast as generating 1 token, but we got", len(tokens))`
            }
          ],
          quiz: [
            {
              q: "Why is LLM token generation memory-bandwidth-bound rather than compute-bound?",
              options: ["GPUs don't have enough FLOPS", "Each decode step reads all model weights from memory to generate one token — memory bandwidth is the bottleneck", "The attention operation is too complex", "Tokenisation is slow"],
              answer: 1,
              explain: "During decode, each token generation requires reading the entire model's weights from HBM (high-bandwidth memory) to compute units. For a 14GB model at 1TB/s bandwidth, that's ~14ms minimum per token regardless of compute capacity. Batching amortises this cost across multiple requests."
            },
            {
              q: "What problem does continuous batching (used by vLLM) solve over static batching?",
              options: ["It uses less GPU memory", "It prevents GPU idle time when requests in a batch finish at different times by swapping in new requests immediately", "It makes individual requests faster", "It reduces model size"],
              answer: 1,
              explain: "Static batching waits for the slowest request before swapping in new work — wasting GPU cycles. Continuous batching swaps in a new request the moment any slot frees, keeping the GPU at near-100% utilisation. Combined with PagedAttention for efficient KV cache management, this is why vLLM achieves dramatically higher throughput."
            },
            {
              q: "A 70B parameter model in float16 requires ~140GB of memory. Approximately how much does 4-bit quantisation reduce this to?",
              options: ["70GB", "35GB", "17GB", "10GB"],
              answer: 1,
              explain: "4-bit is 1/4 of float16's 16 bits, so memory reduces by 4x: 140GB ÷ 4 = 35GB. This fits on 2x consumer 24GB GPUs. The quality loss at 4-bit (with methods like GPTQ or AWQ) is small enough for most production use cases."
            }
          ],
          starter: `# Estimate GPU memory requirements for serving a model
def model_memory_gb(params_billions, precision_bits=16, kv_cache_sequences=32,
                    sequence_length=2048, num_layers=32, num_heads=32, head_dim=128):
    """
    Estimate total GPU memory needed:
    - Model weights
    - KV cache for a given batch of sequences
    """
    # Model weights
    bytes_per_param = precision_bits / 8
    weights_gb = params_billions * 1e9 * bytes_per_param / 1e9
    print(f"Model weights ({precision_bits}-bit): {weights_gb:.1f} GB")

    # KV cache: 2 (K+V) * layers * heads * head_dim * seq_len * batch * bytes
    kv_elements = 2 * num_layers * num_heads * head_dim * sequence_length * kv_cache_sequences
    kv_bytes = kv_elements * (precision_bits / 8)
    kv_gb = kv_bytes / 1e9
    print(f"KV cache ({kv_cache_sequences} seqs, {sequence_length} tokens): {kv_gb:.1f} GB")

    total = weights_gb + kv_gb
    print(f"Total: {total:.1f} GB")
    print()
    return total

print("=== Llama 3 8B ===")
model_memory_gb(params_billions=8, precision_bits=16)

print("=== Llama 3 8B (4-bit quantised) ===")
model_memory_gb(params_billions=8, precision_bits=4)

print("=== Llama 3 70B (4-bit quantised) ===")
model_memory_gb(params_billions=70, precision_bits=4)

# Try changing kv_cache_sequences to see how batch size affects memory
print("=== Effect of batch size on KV cache ===")
for batch in [1, 8, 32, 64]:
    print(f"Batch {batch}:", end=" ")
    model_memory_gb(params_billions=8, precision_bits=16, kv_cache_sequences=batch)
`
        },
        {
          id: "multimodal",
          title: "Multimodal Models",
          tag: "good to know",
          summary: "Modern LLMs process images, audio, and video alongside text. Understanding how modalities are fused is increasingly expected in AI engineering interviews.",
          concepts: [
            {
              title: "How vision is added to a language model",
              body: `A multimodal model takes multiple input types — text, images, audio, video — and produces outputs in one or more modalities. The dominant architecture adds a vision encoder to an existing language model and trains a projection layer to align the two representation spaces.

The three-component architecture (LLaVA / GPT-4V style):
1. Vision encoder: a pretrained image model (usually CLIP's ViT) that converts an image into a sequence of patch embeddings. A 224×224 image split into 14×14 patches = 256 patch tokens, each a 768-dim vector.
2. Projection layer (MLP or cross-attention): maps vision embeddings into the language model's embedding space. This is the bridge — it learns to translate "image representation" into "token-like representation" that the LLM can reason over.
3. Language model backbone: unchanged from the text-only version. It now receives a sequence of [image tokens] + [text tokens] and processes them together with normal attention.

Training procedure:
— Stage 1 (alignment): freeze both vision encoder and LLM. Train only the projection layer on image-caption pairs. Goal: teach the projection to produce embeddings the LLM can interpret.
— Stage 2 (instruction tuning): unfreeze the LLM (or use LoRA). Fine-tune on visual instruction data (image + question + answer triples). Goal: teach the model to follow instructions about images.

CLIP (Contrastive Language-Image Pretraining): trained on 400M image-text pairs to produce matching embeddings for related image-text pairs. The vision encoder from CLIP is nearly universally used as the image encoder in multimodal LLMs because it already understands semantic content.

Resolution matters: original ViT encodes at fixed resolution. Newer models use dynamic resolution (slice image into tiles) or high-res encoders to preserve detail in images with small text, charts, or fine structure.`,
              code: `# Conceptual walkthrough of the multimodal pipeline
import math

def simulate_vision_encoding(image_size=224, patch_size=16, embed_dim=768):
    """
    ViT splits image into patches, each becomes a token.
    This is how CLIP's vision encoder works.
    """
    num_patches = (image_size // patch_size) ** 2
    print(f"Image: {image_size}x{image_size} pixels")
    print(f"Patch size: {patch_size}x{patch_size}")
    print(f"Number of patches (visual tokens): {num_patches}")
    print(f"Each patch → {embed_dim}-dim embedding")
    print(f"Vision encoder output: {num_patches} x {embed_dim} tensor")
    print()
    return num_patches, embed_dim

def simulate_projection(vision_tokens, vision_dim, llm_dim=4096):
    """
    The projection layer maps vision embeddings → LLM token space.
    Simple MLP: vision_dim → llm_dim
    """
    proj_params = vision_dim * llm_dim + llm_dim  # One linear layer
    print(f"Projection layer: {vision_dim} → {llm_dim}")
    print(f"Projection parameters: {proj_params:,}")
    print(f"Output: {vision_tokens} visual tokens, each {llm_dim}-dim")
    print("These look like word embeddings to the LLM")
    print()
    return vision_tokens, llm_dim

def simulate_multimodal_forward(image_size=224, patch_size=16,
                                 text_tokens=50, llm_dim=4096):
    """Full forward pass of a multimodal LLM"""
    print("=== Multimodal Forward Pass ===\\n")

    # Step 1: encode image
    vis_tokens, vis_dim = simulate_vision_encoding(image_size, patch_size)

    # Step 2: project to LLM space
    vis_tokens, _ = simulate_projection(vis_tokens, vis_dim, llm_dim)

    # Step 3: concatenate with text tokens
    total_tokens = vis_tokens + text_tokens
    print(f"LLM input sequence:")
    print(f"  Visual tokens: {vis_tokens}")
    print(f"  Text tokens:   {text_tokens}")
    print(f"  Total:         {total_tokens} tokens")
    print()

    # Attention cost: O(n^2) — visual tokens dominate!
    attention_ops = total_tokens ** 2
    text_only_ops = text_tokens ** 2
    print(f"Attention cost (ops ∝ n²):")
    print(f"  Text only: {text_only_ops:,}")
    print(f"  With image: {attention_ops:,} ({attention_ops/text_only_ops:.0f}x more)")

simulate_multimodal_forward(image_size=224, patch_size=16, text_tokens=50)

print()
print("High-res (448x448):")
simulate_multimodal_forward(image_size=448, patch_size=16, text_tokens=50)`
            },
            {
              title: "Vision-language tasks and what interviewers ask",
              body: `Multimodal models are evaluated on specific tasks, each with standard benchmarks. Knowing what these are tells you what the models are actually good and bad at.

Core vision-language tasks:
— Image captioning: describe what's in an image. Evaluated on COCO (BLEU, CIDEr, METEOR).
— Visual QA (VQA): answer natural language questions about an image. VQA v2, TextVQA (text in images).
— Optical Character Recognition (OCR): read text from images. DocVQA, TextVQA. Models still struggle here.
— Chart/document understanding: interpret graphs, tables, PDFs. ChartQA, DocVQA.
— Visual reasoning: count objects, compare attributes, reason about spatial relationships. MMMU, MathVista.
— Image generation (separate models): DALL-E, Stable Diffusion, Midjourney — text-to-image, not text+image-to-text.

Model families you should know:
— GPT-4V / GPT-4o (OpenAI): strong general visual reasoning, OCR, chart understanding. GPT-4o is native multimodal (joint training, not bolted on).
— Claude 3+ (Anthropic): strong document understanding, can process PDFs, charts, screenshots.
— Gemini (Google): natively multimodal from the start. Gemini 1.5 Pro accepts up to 1 hour of video, 1M token context.
— LLaVA, InternVL, Qwen-VL: open-source alternatives. LLaVA 1.6 is competitive with early GPT-4V on many benchmarks.

Common failure modes:
— Hallucination: confidently describe objects not in the image.
— Counting: models are poor at counting objects beyond ~4-5.
— Fine-grained text: small text in images is often misread.
— Spatial reasoning: "what is to the left of X" is unreliable.
— Grounding: can't reliably return bounding box coordinates without specific training.`,
              code: `# Practical: using a vision model API (conceptual — structure only)
import base64
import json

def encode_image_to_base64(image_path: str) -> str:
    """Most vision APIs accept base64-encoded images"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def build_vision_request(image_path: str, question: str, model="gpt-4o") -> dict:
    """
    Standard structure for vision API requests.
    Works with OpenAI, Anthropic (with minor tweaks).
    """
    image_b64 = "iVBORw0KGgo..."  # Placeholder — use encode_image_to_base64 in real code

    # OpenAI / GPT-4o format
    if "gpt" in model:
        return {
            "model": model,
            "messages": [{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}
                    },
                    {
                        "type": "text",
                        "text": question
                    }
                ]
            }],
            "max_tokens": 500
        }

    # Anthropic / Claude format
    elif "claude" in model:
        return {
            "model": model,
            "max_tokens": 500,
            "messages": [{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64
                        }
                    },
                    {"type": "text", "text": question}
                ]
            }]
        }

def estimate_vision_cost(image_size_px: int, text_tokens: int, model="gpt-4o"):
    """
    Vision tokens are charged differently from text tokens.
    GPT-4o: images billed as token equivalents based on tile count.
    """
    # GPT-4o: 85 base tokens + 170 per 512x512 tile
    tiles = math.ceil(image_size_px / 512) ** 2
    image_tokens = 85 + 170 * tiles
    total_tokens = image_tokens + text_tokens
    cost_per_1k = 0.005  # GPT-4o input: $5/1M tokens
    cost = total_tokens * cost_per_1k / 1000
    print(f"Image {image_size_px}x{image_size_px}: {image_tokens} tokens")
    print(f"Text: {text_tokens} tokens")
    print(f"Estimated cost: \${cost:.4f}")

print("Cost estimates:")
estimate_vision_cost(512, 100)
print()
estimate_vision_cost(1024, 100)
print()
print("Tip: resize images to minimum needed resolution before sending")`
            },
            {
              title: "Audio models and the speech stack",
              body: `Audio is processed differently from vision. The dominant approach converts audio to a spectrogram (2D time-frequency representation) or uses raw waveform encoders, then feeds into a transformer.

Whisper (OpenAI): the standard open-source speech-to-text model. Key facts:
— Trained on 680,000 hours of multilingual audio.
— Architecture: convolutional encoder on log-mel spectrogram → transformer encoder → transformer decoder.
— Processes audio in 30-second chunks. Handles background noise, accents, multiple languages.
— Available in tiny (39M params) to large-v3 (1.5B params) variants.
— Word Error Rate (WER) on English: ~2-3% for large-v3, competitive with commercial APIs.

The speech-to-speech pipeline (voice assistants, phone bots):
1. ASR (Automatic Speech Recognition): audio → text. Whisper, Google STT, AWS Transcribe.
2. LLM: text → text (the reasoning/response step).
3. TTS (Text-to-Speech): text → audio. ElevenLabs, Azure TTS, Google WaveNet.

Latency engineering for voice: the biggest challenge in voice AI is latency. Users expect responses within 500-800ms of finishing speaking. Breakdown:
— ASR: 200-400ms (cloud), 50-150ms (local Whisper)
— LLM TTFT (time to first token): 200-500ms
— TTS: 100-200ms to first audio chunk
— Network round trips: 50-200ms each

Optimisations: streaming ASR (transcribe while user is still talking), streaming LLM (send text to TTS as tokens arrive), TTS streaming (play audio as it's synthesised). With all three, you can target <500ms perceived latency.

End-to-end audio models: GPT-4o Audio, Gemini, and Moshi (open-source) skip the ASR+LLM+TTS pipeline entirely — they process raw audio tokens and generate raw audio tokens. Lower latency, more natural prosody, but harder to control and debug.`,
              code: `# Voice pipeline latency simulator
import time
import random

def simulate_asr(audio_duration_s: float, model="whisper-large") -> tuple:
    """Returns (transcript, latency_ms)"""
    latencies = {
        "whisper-tiny": 50,
        "whisper-large": 150,
        "cloud-asr": 300,
    }
    base_latency = latencies.get(model, 200)
    # Latency scales with audio duration
    latency = base_latency + audio_duration_s * 30
    transcript = f"[Transcription of {audio_duration_s:.1f}s audio]"
    return transcript, latency

def simulate_llm(prompt: str, streaming=False) -> tuple:
    """Returns (response, ttft_ms, total_ms)"""
    ttft = random.randint(200, 500)
    tokens = len(prompt.split()) * 2  # Rough output estimate
    total = ttft + tokens * 20  # 20ms per token decode
    response = f"[LLM response to: {prompt[:30]}...]"
    return response, ttft, total

def simulate_tts(text: str, streaming=False) -> tuple:
    """Returns (audio, time_to_first_audio_ms)"""
    chars = len(text)
    if streaming:
        # Streaming TTS: first chunk ready after ~1 sentence
        ttfa = 100
    else:
        # Wait for full response
        ttfa = chars * 10
    return "[audio bytes]", ttfa

def measure_pipeline_latency(audio_duration=3.0, streaming=True):
    print(f"=== Voice Pipeline ({'streaming' if streaming else 'non-streaming'}) ===")
    print(f"Audio duration: {audio_duration}s\\n")

    _, asr_ms = simulate_asr(audio_duration)
    _, llm_ttft, llm_total = simulate_llm("user query", streaming=streaming)
    _, tts_ttfa = simulate_tts("LLM response text here", streaming=streaming)

    if streaming:
        # With streaming: ASR → LLM TTFT → TTS first chunk
        # These pipeline: ASR must finish, then LLM TTFT, then TTS first chunk
        total_to_first_audio = asr_ms + llm_ttft + tts_ttfa
    else:
        total_to_first_audio = asr_ms + llm_total + tts_ttfa

    print(f"ASR:              {asr_ms:.0f}ms")
    print(f"LLM TTFT:         {llm_ttft:.0f}ms")
    print(f"TTS first chunk:  {tts_ttfa:.0f}ms")
    print(f"Time to first audio: {total_to_first_audio:.0f}ms")
    target = 800
    status = "OK" if total_to_first_audio < target else "TOO SLOW"
    print(f"Target <{target}ms: {status}\\n")

measure_pipeline_latency(streaming=False)
measure_pipeline_latency(streaming=True)`
            }
          ],
          quiz: [
            {
              q: "In a vision-language model like LLaVA, what is the role of the projection layer?",
              options: ["It encodes the image into patches", "It maps vision encoder embeddings into the language model's token embedding space so the LLM can process them", "It generates the final text output", "It compresses the image to save memory"],
              answer: 1,
              explain: "The vision encoder (CLIP ViT) produces image patch embeddings in its own representation space. The LLM expects embeddings in its token space. The projection layer — a small MLP — is trained to translate between these two spaces, making visual tokens look like word embeddings to the LLM."
            },
            {
              q: "What is the biggest latency challenge in a production voice AI pipeline?",
              options: ["ASR is too slow", "Getting time-to-first-audio under ~800ms requires streaming ASR, LLM, and TTS simultaneously", "TTS produces too much data", "LLMs can't process audio"],
              answer: 1,
              explain: "Users perceive delays >800ms as unnatural in conversation. A non-streaming pipeline (ASR ~300ms + LLM full response ~1000ms + TTS ~200ms = ~1500ms) is too slow. Streaming each stage — transcribing while the user speaks, sending partial LLM output to TTS as tokens arrive, playing audio as it's synthesised — can get this under 500ms."
            },
            {
              q: "Why are multimodal models unreliable for counting objects in images?",
              options: ["They don't support images with many objects", "Vision transformers represent objects as distributed patch embeddings — there is no discrete per-object counter; counting requires global reasoning the model learns imperfectly", "The images are too low resolution", "Counting requires a calculator tool"],
              answer: 1,
              explain: "ViT encoders represent an image as a grid of patch embeddings — there is no explicit object detection or counting mechanism. The model must learn to count from patch features, which it does poorly beyond small numbers. This is a known failure mode; use dedicated object detection models if counting accuracy matters."
            }
          ],
          starter: `# Explore multimodal token costs and resolution trade-offs
import math

def vision_token_cost(width: int, height: int, model="gpt-4o"):
    """
    GPT-4o charges for images based on 512x512 tiles.
    Each tile = 170 tokens + 85 base tokens.
    """
    tiles_w = math.ceil(width / 512)
    tiles_h = math.ceil(height / 512)
    total_tiles = tiles_w * tiles_h
    tokens = 85 + 170 * total_tiles
    return tokens, total_tiles

def recommend_resolution(task: str) -> str:
    """Resolution recommendations by task type"""
    recommendations = {
        "general_qa": (512, 512),       # Low detail OK
        "document_ocr": (1024, 1024),   # Need to read text
        "chart_analysis": (768, 768),   # Medium detail
        "screenshot": (1280, 720),      # Preserve layout
    }
    size = recommendations.get(task, (512, 512))
    tokens, tiles = vision_token_cost(*size)
    return f"{task}: {size[0]}x{size[1]} → {tiles} tiles → {tokens} tokens"

print("=== Token costs by image size ===")
for size in [(256, 256), (512, 512), (1024, 1024), (2048, 2048)]:
    tokens, tiles = vision_token_cost(*size)
    cost = tokens * 5 / 1_000_000  # GPT-4o: $5/1M tokens
    print(f"{size[0]}x{size[1]}: {tiles} tiles, {tokens} tokens, \${cost:.4f}")

print()
print("=== Recommended resolutions by task ===")
for task in ["general_qa", "document_ocr", "chart_analysis", "screenshot"]:
    print(recommend_resolution(task))

print()
print("Key insight: always resize to the minimum resolution that preserves")
print("the detail your task needs. 4x resolution = 4x tokens = 4x cost.")
`
        }
      ]
    },
    {
      id: "rag",
      title: "RAG & Agents",
      icon: "◎",
      color: "#FCA5A5",
      desc: "The bread and butter of LLM engineering roles in 2025",
      lessons: [
        {
          id: "rag-fundamentals",
          title: "RAG Fundamentals",
          tag: "must know",
          summary: "Retrieval Augmented Generation — the most common LLM architecture you'll build and interview about.",
          concepts: [
            {
              title: "Why RAG exists and when to use it",
              body: `LLMs have two fundamental limitations: a training knowledge cutoff and no access to private data. RAG (Retrieval Augmented Generation) solves both by fetching relevant documents at query time and including them in the prompt. The model reads your data fresh every query — no retraining required.

The full pipeline: User query → embed query → vector similarity search → retrieve top-k chunks → build augmented prompt → LLM generates grounded answer.

RAG vs fine-tuning — the most common interview question on this topic:
— Use RAG when: data changes frequently, you need source citations, data is too large for the context window, or you want to update knowledge without retraining.
— Use fine-tuning when: you need to change the model's behaviour/tone/style, you have a very specific task with thousands of examples, or you need lower latency (smaller model after fine-tuning).
— In practice: RAG first, fine-tune if RAG quality isn't sufficient.

RAG advantages over stuffing everything in context: cheaper (you only pay for relevant chunks), faster (smaller prompts), and more accurate (relevant signal vs noise). But it introduces retrieval failures — if the right chunk isn't retrieved, the answer will be wrong even if the document exists.`,
              code: `# RAG pipeline — conceptual implementation
from typing import List

class SimpleRAG:
    def __init__(self, embedding_fn, vector_db, llm_fn):
        self.embed = embedding_fn
        self.db = vector_db
        self.llm = llm_fn

    def index_documents(self, documents: List[str]):
        """Offline step: embed and store all documents"""
        for doc in documents:
            embedding = self.embed(doc)
            self.db.upsert(embedding, doc)

    def query(self, user_question: str, k: int = 5) -> str:
        """Online step: retrieve + generate"""
        # Step 1: embed the question
        query_embedding = self.embed(user_question)

        # Step 2: find k most similar document chunks
        top_chunks = self.db.search(query_embedding, k=k)

        # Step 3: build the augmented prompt
        context = "\\n\\n---\\n\\n".join([c.text for c in top_chunks])
        prompt = f"""Answer using only the context below.
If the answer isn't in the context, say "I don't know."

Context:
{context}

Question: {user_question}
Answer:"""

        # Step 4: generate
        return self.llm(prompt)

# Key insight: the model never "knows" your data
# It reads the retrieved chunks fresh on every query
print("RAG = Retrieve → Augment → Generate")
print("Retrieval quality IS answer quality — garbage in, garbage out")`
            },
            {
              title: "Chunking strategies",
              body: `Chunking is how you split documents before embedding and storing them. It's the most impactful variable in RAG quality — more so than model choice in many cases. The goal: each chunk should be semantically coherent and self-contained enough to answer questions about it.

Fixed-size chunking (naive): split every N tokens/characters with some overlap. Fast and simple, but splits arbitrarily — a sentence can be cut in half. Use only as a baseline.

Sentence/paragraph chunking: split on sentence boundaries or paragraph breaks. Respects natural language structure. Much better than fixed-size for most documents.

Semantic chunking: use an embedding model to detect topic shifts. When adjacent sentences become semantically dissimilar, that's a chunk boundary. Most accurate but computationally expensive.

Hierarchical (parent-child) chunking: store small chunks for precise retrieval, but retrieve larger parent chunks for more context. Index at sentence level, return the surrounding paragraph. This solves the tension between retrieval precision and context completeness.

Chunk size guidance: for dense technical text, 256-512 tokens works well. For conversational text or FAQs, 128-256 tokens. Overlap of 10-15% prevents information loss at boundaries. Always experiment on your specific data — there's no universal answer.`,
              code: `import re

def chunk_fixed(text, chunk_size=500, overlap=50):
    """Naive: every N chars with overlap"""
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start:start + chunk_size])
        start += chunk_size - overlap
    return chunks

def chunk_by_paragraph(text):
    """Respects natural structure"""
    return [p.strip() for p in text.split("\\n\\n") if p.strip()]

def chunk_by_sentence(text, max_sentences=4, overlap=1):
    """Group N sentences, with 1-sentence overlap"""
    sentences = re.split(r'(?<=[.!?])\\s+', text.strip())
    chunks = []
    i = 0
    while i < len(sentences):
        chunk = " ".join(sentences[i:i + max_sentences])
        if chunk:
            chunks.append(chunk)
        i += max_sentences - overlap
    return chunks

# Hierarchical chunking concept:
def chunk_hierarchical(text):
    """Small chunks for retrieval, parent paragraphs for context"""
    paragraphs = chunk_by_paragraph(text)
    result = []
    for para_idx, para in enumerate(paragraphs):
        sentences = re.split(r'(?<=[.!?])\\s+', para)
        for sent in sentences:
            result.append({
                "chunk": sent,              # what gets embedded
                "parent": para,             # what gets returned to LLM
                "para_idx": para_idx
            })
    return result

sample = """The hotel offers 200 rooms across 15 floors.
Check-in is at 3 PM and check-out at 11 AM.

The restaurant serves breakfast from 7-10 AM.
Room service is available 24 hours a day."""

print("Paragraph chunks:", chunk_by_paragraph(sample))
print("\\nHierarchical chunks:", len(chunk_hierarchical(sample)))`
            },
            {
              title: "Vector databases & similarity search",
              body: `A vector database stores embeddings (high-dimensional float vectors) and supports fast approximate nearest-neighbour (ANN) search. This is the storage and retrieval backbone of every RAG system.

Embeddings: each chunk of text is converted to a vector (e.g., 1536 dimensions for OpenAI's text-embedding-3-small) by an embedding model. Semantically similar text produces similar vectors — this is what enables semantic search.

Similarity metrics:
— Cosine similarity: angle between vectors. Most common for text. Range [-1, 1]. Ignores magnitude.
— Dot product: similar to cosine but magnitude matters. Faster to compute.
— Euclidean distance: geometric distance. Less common for text.

Vector DB options:
— FAISS (Facebook): in-memory, open-source, no server needed. Best for prototyping and small-medium datasets (<10M vectors).
— Chroma: open-source, easy Python API, great for local development.
— Pinecone: fully managed cloud service, scales to billions of vectors, handles infrastructure.
— Qdrant / Weaviate: open-source, self-hosted, production-ready with filtering support.
— pgvector: add vector search to an existing PostgreSQL DB — great if you already use Postgres.

Indexing algorithms: HNSW (Hierarchical Navigable Small World) is the dominant algorithm — O(log n) query time with high recall. IVF (Inverted File Index) works better for very large datasets. Both trade perfect recall for speed.`,
              code: `import numpy as np

# Similarity metrics — understand these cold
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

# Example: semantic similarity between embeddings
# (using random vectors here — in practice use an embedding model)
np.random.seed(42)

# Simulate: "hotel check-in" is similar to "arrival time"
# by making their vectors close
hotel_checkin = np.random.randn(8)
arrival_time  = hotel_checkin + np.random.randn(8) * 0.3   # close
swimming_pool = np.random.randn(8)                          # unrelated

print("check-in vs arrival:", round(cosine_similarity(hotel_checkin, arrival_time), 3))
print("check-in vs pool:   ", round(cosine_similarity(hotel_checkin, swimming_pool), 3))

# Simple brute-force vector search (what FAISS does, just faster)
class SimpleVectorDB:
    def __init__(self):
        self.vectors = []
        self.texts = []

    def add(self, text, embedding):
        self.texts.append(text)
        self.vectors.append(embedding)

    def search(self, query_vec, k=3):
        scores = [cosine_similarity(query_vec, v) for v in self.vectors]
        top_k = sorted(enumerate(scores), key=lambda x: -x[1])[:k]
        return [(self.texts[i], score) for i, score in top_k]

db = SimpleVectorDB()
db.add("Check-in at 3 PM", np.array([1.0, 0.9, 0.1, 0.0, 0.1, 0.0, 0.0, 0.0]))
db.add("Pool open 8 AM-9 PM", np.array([0.1, 0.0, 0.0, 1.0, 0.9, 0.1, 0.0, 0.0]))
db.add("Breakfast from 7-10 AM", np.array([0.2, 0.1, 0.8, 0.0, 0.0, 0.9, 0.0, 0.1]))

query = np.array([0.9, 0.8, 0.1, 0.0, 0.1, 0.1, 0.0, 0.0])   # "when can I arrive?"
for text, score in db.search(query):
    print(f"{score:.3f}: {text}")`
            },
            {
              title: "Hybrid search & reranking",
              body: `Pure vector search has a weakness: it finds semantically similar text, but can miss exact keyword matches. "What is the cancellation policy for booking TBO-45231?" — the booking ID won't be semantically similar to anything. Pure keyword search (BM25) misses semantic relationships. Hybrid search combines both.

BM25 (Best Match 25) is the dominant keyword search algorithm. It's a probabilistic extension of TF-IDF that accounts for document length and term saturation. Most production RAG systems use hybrid: BM25 for keyword recall + vector search for semantic recall, then merge results.

Reciprocal Rank Fusion (RRF): a simple, effective way to merge ranked lists from multiple retrieval methods. For each document, its score = sum of 1/(rank + k) across all lists (k=60 is standard). No need to normalise scores from different systems.

Reranking: after retrieving top-k candidates (e.g., 20), run a cross-encoder model to re-score them. Cross-encoders take both the query and document as joint input — far more accurate than bi-encoders (separate embeddings) but too slow to run on the full corpus. The typical pipeline: bi-encoder retrieval (fast, approximate) → cross-encoder reranking (slow, accurate) → return top-5. Models like Cohere Rerank or open-source BGE-reranker are commonly used.`,
              code: `# BM25 keyword scoring (simplified)
import math
from collections import Counter

def bm25_score(query_terms, doc_terms, k1=1.5, b=0.75, avg_doc_len=100):
    doc_len = len(doc_terms)
    doc_freq = Counter(doc_terms)
    score = 0.0
    for term in query_terms:
        if term not in doc_freq:
            continue
        tf = doc_freq[term]
        # BM25 term frequency saturation
        tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc_len / avg_doc_len))
        score += tf_norm   # simplified: skip IDF for illustration
    return score

# Reciprocal Rank Fusion — merge ranked lists
def reciprocal_rank_fusion(ranked_lists, k=60):
    scores = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list):
            scores[doc_id] = scores.get(doc_id, 0) + 1.0 / (rank + k)
    return sorted(scores.items(), key=lambda x: -x[1])

# Example: combine vector search results + BM25 results
vector_results = ["doc_3", "doc_1", "doc_5", "doc_2"]   # by cosine sim
keyword_results = ["doc_1", "doc_4", "doc_3", "doc_2"]  # by BM25

fused = reciprocal_rank_fusion([vector_results, keyword_results])
print("Hybrid ranking:")
for doc_id, score in fused:
    print(f"  {doc_id}: {score:.4f}")

# In production: use LangChain EnsembleRetriever or
# Pinecone/Qdrant's built-in hybrid search`
            },
            {
              title: "RAG evaluation — RAGAS and what to measure",
              body: `RAG systems are hard to evaluate because both the retrieval and the generation can fail independently. A framework called RAGAS (RAG Assessment) defines four key metrics that together give a complete picture.

1. Faithfulness: does the answer contain only information from the retrieved context? Measures hallucination. Score = fraction of answer claims that are grounded in the context. High faithfulness means the model isn't making things up.

2. Answer Relevancy: is the answer relevant to the question? A faithful but off-topic answer scores high on faithfulness but low here. Measured by embedding the answer and checking similarity to the question.

3. Context Precision: of the retrieved chunks, what fraction were actually useful? If you retrieve 5 chunks but only 1 was needed, context precision is 0.2. Low precision wastes context window space and can confuse the model.

4. Context Recall: were all the relevant chunks retrieved? If the answer requires 3 facts and only 2 are in the retrieved context, recall is 0.67. Low recall means the retriever is missing relevant information.

Beyond RAGAS, track these in production: end-to-end latency (time to first token), retrieval latency, cost per query (tokens), and user satisfaction (thumbs up/down). Build an offline evaluation set: 50-100 question/answer pairs with known correct answers. Run this set after every change to detect regressions.

The most common RAG failure modes: (1) wrong chunks retrieved (improve embeddings or chunking), (2) right chunks retrieved but answer is wrong (improve the prompt or LLM), (3) slow retrieval (optimise vector DB indexing), (4) context too long (reduce k or chunk size).`,
              code: `# RAGAS-style evaluation (simplified — real RAGAS uses LLM judges)

def faithfulness_score(answer: str, context_chunks: list) -> float:
    """What fraction of answer sentences are grounded in context?"""
    answer_sentences = answer.split('. ')
    context_text = ' '.join(context_chunks).lower()
    grounded = 0
    for sentence in answer_sentences:
        # Simplified: check if key words appear in context
        key_words = [w for w in sentence.lower().split() if len(w) > 4]
        if any(w in context_text for w in key_words):
            grounded += 1
    return grounded / len(answer_sentences) if answer_sentences else 0.0

def context_precision(retrieved_chunks: list, relevant_chunks: list) -> float:
    """What fraction of retrieved chunks were relevant?"""
    relevant_set = set(relevant_chunks)
    useful = sum(1 for c in retrieved_chunks if c in relevant_set)
    return useful / len(retrieved_chunks) if retrieved_chunks else 0.0

def context_recall(retrieved_chunks: list, relevant_chunks: list) -> float:
    """What fraction of relevant chunks were retrieved?"""
    retrieved_set = set(retrieved_chunks)
    found = sum(1 for c in relevant_chunks if c in retrieved_set)
    return found / len(relevant_chunks) if relevant_chunks else 0.0

# Example evaluation
retrieved = ["Check-in at 3PM", "Pool open 8AM-9PM", "Breakfast 7-10AM"]
relevant  = ["Check-in at 3PM", "Breakfast 7-10AM"]   # ground truth

print(f"Context Precision: {context_precision(retrieved, relevant):.2f}")   # 0.67
print(f"Context Recall:    {context_recall(retrieved, relevant):.2f}")      # 1.00`
            }
          ],
          quiz: [
            {
              q: "What problem does RAG solve?",
              options: ["Makes LLMs faster", "Gives LLMs access to private/current data without retraining", "Eliminates hallucinations entirely", "Reduces API costs always"],
              answer: 1,
              explain: "LLMs are frozen at training cutoff and don't know your private data. RAG retrieves relevant documents at query time and includes them in the prompt — the model reads your data fresh each query, no fine-tuning needed."
            },
            {
              q: "What is the difference between context precision and context recall in RAG evaluation?",
              options: ["They measure the same thing", "Precision = were retrieved chunks useful? Recall = were all needed chunks retrieved?", "Precision is about speed, recall is about accuracy", "They only apply to keyword search"],
              answer: 1,
              explain: "Precision asks 'of what we retrieved, how much was useful?' (quality). Recall asks 'of what was relevant, how much did we find?' (coverage). You need both — high precision but low recall means missing information; high recall but low precision wastes context and adds noise."
            },
            {
              q: "Why is hybrid search (vector + BM25) better than pure vector search?",
              options: ["It's always faster", "Vector search misses exact keyword matches; BM25 misses semantic similarity; hybrid covers both", "BM25 is more accurate than vectors", "Hybrid uses less memory"],
              answer: 1,
              explain: "A booking ID like 'TBO-45231' has no semantic embedding — pure vector search won't find it. A conceptual query like 'when can I arrive' has no keywords — pure BM25 won't find 'check-in time'. Hybrid search combines both recall paths."
            }
          ],
          starter: `# Implement keyword overlap search — the BM25 baseline
def keyword_search(query, documents):
    """Score documents by keyword overlap with query"""
    query_words = set(query.lower().split())
    scored = []
    for i, doc in enumerate(documents):
        doc_words = set(doc.lower().split())
        overlap = len(query_words & doc_words)
        scored.append((overlap, i, doc))
    scored.sort(reverse=True)
    return [(doc, score) for score, _, doc in scored if score > 0]

docs = [
    "Hotel check-in is at 3 PM, check-out at 11 AM",
    "The restaurant serves breakfast from 7 to 10 AM",
    "Free WiFi available in all rooms and common areas",
    "Swimming pool open 8 AM to 9 PM daily",
]

for doc, score in keyword_search("what time is check-in", docs):
    print(f"Score {score}: {doc}")`
        },
        {
          id: "ai-agents",
          title: "AI Agents & Tool Use",
          tag: "must know",
          summary: "Agents are LLMs that take actions, not just generate text. Understanding the ReAct loop, tool calling, and orchestration patterns is essential for senior AI engineering roles.",
          concepts: [
            {
              title: "What makes something an agent — the core loop",
              body: `An agent is an LLM system that iterates: perceive → think → act → observe → repeat. The key distinction from a simple chatbot is that an agent takes actions in the world (API calls, code execution, file writes, web search) and uses the results to inform its next step. A chatbot produces one output per input; an agent runs a loop until the task is done or it gives up.

The minimal agent loop: (1) receive task, (2) think about what action to take, (3) execute the action, (4) observe the result, (5) decide: am I done? If yes, return answer. If no, go to step 2.

Three things every agent needs:
— A model that can reason about tool use (GPT-4, Claude, Gemini — all support this natively)
— A set of tools the model can call (search, calculator, database query, etc.)
— A loop that feeds tool results back as context for the next step

Why this matters for interviews: interviewers want to see that you understand agents aren't magic — they're LLM calls in a loop with structured tool interfaces. The failure modes are predictable (tool errors, hallucinated tool calls, infinite loops) and the solutions are engineering problems.

Agent vs workflow: a workflow is a predefined sequence of steps (DAG). An agent decides its own sequence at runtime. Workflows are more predictable and auditable; agents are more flexible and can handle unanticipated situations. For production systems with known structure, prefer workflows. Use agents when the task structure is genuinely unknown until runtime.`,
              code: `# Minimal agent loop — stripped to essentials
import json

def call_llm(messages, tools=None):
    """Stub — replace with actual API call"""
    # Returns {"role": "assistant", "content": "...", "tool_calls": [...]}
    return {"role": "assistant", "content": "Using calculator", "tool_calls": [
        {"id": "call_1", "function": {"name": "calculator", "arguments": '{"expr": "2 ** 10"}'}}
    ]}

def calculator(expr):
    return str(eval(expr))  # Don't do this in prod — use ast.literal_eval or a safe parser

TOOLS = {
    "calculator": calculator,
}

def run_agent(task, max_iterations=10):
    messages = [{"role": "user", "content": task}]

    for i in range(max_iterations):
        response = call_llm(messages)
        messages.append(response)

        # If no tool calls, agent is done
        if not response.get("tool_calls"):
            print(f"Agent answer: {response['content']}")
            return response["content"]

        # Execute each tool call
        for tool_call in response["tool_calls"]:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            result = TOOLS[name](**args)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call["id"],
                "content": result
            })

        print(f"Iteration {i+1}: called {name}, got {result}")

    return "Max iterations reached"

# In practice the LLM decides the next tool call based on the full message history
result = run_agent("What is 2 to the power of 10?")
print(f"Final answer: {result}")`
            },
            {
              title: "Tool use and function calling — the interface contract",
              body: `Function calling (OpenAI's term) / tool use (Anthropic's term) is how you give an LLM structured access to external functions. You describe available functions in a schema, the LLM returns a structured call (function name + arguments as JSON), you execute it and return the result. The LLM never directly executes code — it produces a description of what to call and you run it.

The schema is the contract. Every tool needs: name (unique identifier), description (this is crucial — the model reads this to decide when to use the tool), and parameters (JSON Schema defining the expected arguments). Write descriptions as if explaining to a smart human what the tool does and when to use it.

Tool design principles:
— Atomic tools beat swiss-army-knife tools. One function that does one thing is easier to reason about.
— Idempotent tools are safer. If the model calls the same tool twice, should the result be the same? Prefer tools where yes.
— Always validate tool inputs. The model can hallucinate arguments. Never trust them blindly.
— Return structured data when possible. Plain text forces the model to parse; JSON means it can use it directly.
— Include error information in the return. "No results found" is more useful than an exception traceback.

Parallel tool calls: modern models can call multiple tools simultaneously when they don't depend on each other. Implement async execution for these. If retrieving weather in 3 cities, make 3 concurrent API calls, not 3 sequential ones.

The hardest interview question: "How do you prevent the model from calling a dangerous tool?" Answer: tool whitelisting (only expose what you intend), input validation (check before executing), confirmation steps for destructive actions, rate limiting per session, and audit logging of every tool call.`,
              code: `# Tool schema definition + dispatching pattern
import json

# Define tools with rich descriptions
TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "search_knowledge_base",
            "description": "Search internal documentation for answers. Use when the user asks about product features, policies, or procedures. Do NOT use for general knowledge questions.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query. Be specific — 'refund policy for digital products' is better than 'refunds'"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max results to return (1-10)",
                        "default": 3
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_ticket",
            "description": "Create a support ticket. Only use when the user explicitly asks to create, log, or file a ticket. Do not create tickets proactively.",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]}
                },
                "required": ["summary", "priority"]
            }
        }
    }
]

# Tool dispatcher with input validation
def search_knowledge_base(query: str, limit: int = 3):
    if not query or len(query) > 200:
        return {"error": "Invalid query: must be 1-200 chars"}
    # Real impl: vector search + return results
    return {"results": [{"text": f"Result for: {query}", "score": 0.9}][:limit]}

def create_ticket(summary: str, priority: str):
    valid_priorities = {"low", "medium", "high"}
    if priority not in valid_priorities:
        return {"error": f"Invalid priority. Must be one of: {valid_priorities}"}
    ticket_id = f"TKT-{hash(summary) % 10000:04d}"
    return {"ticket_id": ticket_id, "status": "created"}

TOOL_HANDLERS = {
    "search_knowledge_base": search_knowledge_base,
    "create_ticket": create_ticket,
}

def dispatch_tool(tool_call):
    name = tool_call["function"]["name"]
    if name not in TOOL_HANDLERS:
        return {"error": f"Unknown tool: {name}"}
    try:
        args = json.loads(tool_call["function"]["arguments"])
        return TOOL_HANDLERS[name](**args)
    except Exception as e:
        return {"error": str(e)}

# Test the dispatcher
result = dispatch_tool({
    "function": {"name": "search_knowledge_base", "arguments": '{"query": "refund policy"}'}
})
print(result)

result = dispatch_tool({
    "function": {"name": "create_ticket", "arguments": '{"summary": "Login broken", "priority": "high"}'}
})
print(result)`
            },
            {
              title: "ReAct — reasoning and acting interleaved",
              body: `ReAct (Reasoning + Acting) is the dominant prompting pattern for agents. The core insight: interleaving explicit reasoning traces (Thought: ...) with actions (Action: ...) and observations (Observation: ...) produces significantly more reliable agents than just issuing tool calls without reasoning.

The ReAct cycle:
1. Thought: the model reasons about the current state and what to do next
2. Action: the model issues a tool call
3. Observation: the tool result is fed back
4. Repeat until: Thought: I now have enough information. Final Answer: ...

Why ReAct beats direct tool calling: the explicit reasoning step helps the model catch its own errors ("Wait, I searched for X but the question was actually about Y"), decide between multiple possible actions, and produce reasoning traces that are auditable by humans.

Chain-of-thought in the Thought step is crucial. "I should search" is worse than "The user asked about the Q3 refund rate. I need the refund count and total orders for Q3. I'll query the analytics database with a date filter of 2024-07-01 to 2024-09-30." The specificity in reasoning produces more accurate tool calls.

For interviews: know that ReAct was the first paper to systematically show that reasoning + acting together beats either alone. The pattern underpins LangChain's AgentExecutor, OpenAI's Assistants API, and most production agent frameworks.

Self-reflection / self-critique is the extension: after producing an answer, have the agent evaluate its own answer and revise. "Is my answer complete? Did I miss any edge cases?" This adds latency but catches errors before returning to the user.`,
              code: `# ReAct pattern — explicit thought/action/observation traces
# This shows the message structure that produces ReAct behaviour

REACT_SYSTEM_PROMPT = """You are a helpful assistant with access to tools.
For each step, structure your response as:

Thought: [your reasoning about what to do next]
Action: [the tool you will call and why]

After receiving tool results:
Thought: [reasoning about what the result means]
Action: [next tool call OR if done: "Final Answer"]
Final Answer: [your complete answer to the user]

Always reason before acting. Check your work before giving a final answer."""

def react_agent_trace(task):
    """Simulate a ReAct trace for demonstration"""
    trace = [
        {
            "step": 1,
            "thought": f"The user asked: '{task}'. I need to find relevant information. I'll search the knowledge base first.",
            "action": "search_knowledge_base(query='refund policy digital products')",
            "observation": "Found 2 results: [1] 'Digital products are non-refundable within 24h of first access' [2] 'Exceptions: technical issues preventing access'"
        },
        {
            "step": 2,
            "thought": "The search returned a policy, but I should check if there are any recent updates or exceptions.",
            "action": "search_knowledge_base(query='refund exceptions 2024 updates')",
            "observation": "Found: 'Updated Dec 2024: customers with < 3 previous refunds may request exception via support'"
        },
        {
            "step": 3,
            "thought": "I now have the base policy and the exception. I can answer the question completely.",
            "action": "Final Answer",
            "observation": None
        }
    ]

    for step in trace:
        print(f"=== Step {step['step']} ===")
        print(f"Thought: {step['thought']}")
        print(f"Action: {step['action']}")
        if step['observation']:
            print(f"Observation: {step['observation']}")
        print()

    answer = "Digital products are non-refundable after first access within 24h. Exception: if you've had fewer than 3 previous refunds, you can request a manual exception through support."
    print(f"Final Answer: {answer}")
    return answer

react_agent_trace("Can I get a refund on a digital course I bought yesterday?")`
            },
            {
              title: "Multi-agent orchestration patterns",
              body: `Single agents hit limits: context windows fill up on long tasks, one agent can't be an expert at everything, and sequential execution is slow when sub-tasks are independent. Multi-agent systems address these by distributing work.

The three main patterns:

1. Orchestrator-worker (most common): one orchestrator agent breaks the task into sub-tasks and delegates to specialised worker agents. The orchestrator synthesises the results. Workers can run in parallel if sub-tasks are independent. Example: a research agent orchestrates a search agent, a summarisation agent, and a citation-checking agent.

2. Pipeline (assembly line): output of agent A feeds directly into agent B. Rigid but predictable. Good when each step transforms the data in a well-defined way. Example: extract → validate → enrich → format.

3. Debate / critic pattern: multiple agents produce answers independently, then a judge agent (or the model itself) evaluates and resolves disagreements. Expensive but useful for high-stakes decisions.

Memory architecture in multi-agent systems — this is where interviews get deep:
— In-context memory: the conversation history (limited by context window)
— External short-term memory: shared state in Redis between agents in the same session
— Long-term memory: vector database of past interactions (episodic memory), or a structured store of facts the agent has learned (semantic memory)
— Procedural memory: few-shot examples of how to do tasks (stored in prompts)

Failure modes unique to multi-agent systems:
— Cascading errors: worker A produces bad output that worker B uses as ground truth
— Communication overhead: too many agents = too many LLM calls = high latency and cost
— Coordination deadlock: agent A waits for B, B waits for A
— Context loss: agents don't share context, so the same question gets researched twice

Production rule: start with a single agent. Only add agents when you've hit a concrete limit (context window overflow, specialisation needed, parallelism required). Multi-agent systems are exponentially harder to debug.`,
              code: `# Orchestrator-worker pattern with parallel execution
import asyncio
from typing import Callable

class Agent:
    def __init__(self, name: str, system_prompt: str, tools: dict):
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools

    async def run(self, task: str) -> str:
        print(f"[{self.name}] Starting: {task[:60]}...")
        # Stub — real impl calls LLM with self.system_prompt and self.tools
        await asyncio.sleep(0.1)  # Simulate LLM call latency
        return f"[{self.name} result for: {task}]"

class Orchestrator:
    def __init__(self, workers: list):
        self.workers = {w.name: w for w in workers}

    async def run_parallel(self, tasks: dict) -> dict:
        """Run multiple worker tasks in parallel"""
        coroutines = {
            name: self.workers[name].run(task)
            for name, task in tasks.items()
            if name in self.workers
        }
        results = await asyncio.gather(*coroutines.values())
        return dict(zip(coroutines.keys(), results))

    async def orchestrate(self, goal: str) -> str:
        print(f"[Orchestrator] Goal: {goal}\\n")

        # Step 1: decompose goal into parallel sub-tasks
        sub_tasks = {
            "researcher": f"Find facts about: {goal}",
            "analyst": f"Identify risks related to: {goal}",
        }

        # Step 2: run workers in parallel
        results = await self.run_parallel(sub_tasks)

        # Step 3: synthesise
        synthesis = f"Synthesis of {len(results)} worker outputs:\\n"
        for worker, result in results.items():
            synthesis += f"  {worker}: {result}\\n"
            print(f"  Got from {worker}: {result}")

        return synthesis

# Build the multi-agent system
researcher = Agent("researcher", "You find relevant facts.", {})
analyst = Agent("analyst", "You identify risks and opportunities.", {})
orch = Orchestrator([researcher, analyst])

# Run it
result = asyncio.run(orch.orchestrate("Launch an AI-powered customer support product"))
print(f"\\nFinal synthesis:\\n{result}")`
            }
          ],
          quiz: [
            {
              q: "What is the key difference between an agent and a simple chatbot?",
              options: ["Agents use larger models", "Agents run in a loop taking actions and observing results; chatbots produce one output per input", "Chatbots can't use tools", "Agents always run in parallel"],
              answer: 1,
              explain: "The defining characteristic of an agent is the perceive-think-act-observe loop. A chatbot maps input to output once. An agent iterates — it takes an action, observes the result, and decides whether to take another action. The loop runs until the task is complete."
            },
            {
              q: "In the ReAct pattern, what is the purpose of the explicit 'Thought' step?",
              options: ["It makes the output longer", "It helps the model reason about its current state, catch errors, and produce more accurate tool calls", "It is required by the API", "It replaces tool calls"],
              answer: 1,
              explain: "The Thought step forces the model to reason explicitly before acting. This produces more accurate tool calls (because the model plans what to search for, not just searches), and makes the agent's reasoning auditable. The paper 'ReAct' showed that interleaved reasoning+acting beats either alone."
            },
            {
              q: "What is the main risk when using multi-agent systems?",
              options: ["They always cost more", "Cascading errors where bad output from one agent is used as ground truth by another", "Agents can't communicate", "Multi-agent systems are always slower"],
              answer: 1,
              explain: "In a pipeline or orchestrator pattern, agent B trusts agent A's output. If A produces incorrect data, B builds on it — the error compounds. This is harder to debug than a single-agent system. Always validate inter-agent outputs and design agents to express uncertainty rather than confident wrong answers."
            }
          ],
          starter: `# Build a minimal tool-using agent
# Task: extend this agent with a "web_search" tool

import json

# Simulated tool results (replace with real APIs)
def get_weather(city: str) -> dict:
    weather_db = {
        "london": {"temp_c": 12, "condition": "cloudy"},
        "tokyo": {"temp_c": 22, "condition": "sunny"},
        "new york": {"temp_c": 18, "condition": "partly cloudy"}
    }
    city_lower = city.lower()
    if city_lower in weather_db:
        return weather_db[city_lower]
    return {"error": f"No data for {city}"}

def calculate(expression: str) -> dict:
    try:
        # Safe: only allow numbers and basic operators
        allowed = set("0123456789+-*/.() ")
        if not all(c in allowed for c in expression):
            return {"error": "Invalid characters in expression"}
        result = eval(expression)
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}

TOOLS = {"get_weather": get_weather, "calculate": calculate}

# Simulate the agent loop
def agent_loop(user_query: str):
    print(f"User: {user_query}")
    print()

    # Simulated LLM decisions (in real impl, these come from the model)
    if "weather" in user_query.lower():
        city = "London"  # In real impl, model extracts this
        print(f"Thought: User wants weather. I'll call get_weather for {city}.")
        result = TOOLS["get_weather"](city)
        print(f"Tool result: {result}")
        print(f"Thought: I have the data. I can answer.")
        print(f"Answer: The weather in {city} is {result.get('temp_c')}°C and {result.get('condition')}.")
    else:
        print("Thought: This is a general question. I can answer directly.")
        print("Answer: I don't have specific data for that query.")

agent_loop("What's the weather like in London?")
print()
agent_loop("How many days until Christmas?")  # Try extending the agent to handle this!
`
        },
        {
          id: "advanced-rag",
          title: "Advanced RAG Techniques",
          tag: "senior",
          summary: "Basic RAG fails on complex queries. These techniques — query rewriting, HyDE, multi-hop reasoning, and deep reranking — are what separate a working prototype from a production system.",
          concepts: [
            {
              title: "Query transformation — why the user's question is often bad for retrieval",
              body: `The single biggest RAG quality lever that most engineers miss: the user's raw query is often a poor retrieval query. Users ask vague, ambiguous, or context-dependent questions. Retrieval works best on specific, standalone queries. Query transformation bridges the gap.

Five query transformation techniques:

1. Query rewriting: rephrase the user's question to be more specific and retrieval-friendly. "Tell me about the thing we discussed earlier" → "Explain the policy on remote work expense reimbursement". Done with a small LLM call before retrieval.

2. HyDE (Hypothetical Document Embeddings): generate a hypothetical answer to the question, then embed and retrieve documents similar to that answer rather than the question. The insight: a hypothetical answer shares vocabulary and structure with real answers, while the original question may not. Works especially well for factual queries where the question phrasing is very different from how the answer is written.

3. Step-back prompting: ask a more general version of the question first, retrieve on the generalised query, then answer the specific question with broader context. "What is the refund policy for orders placed on Black Friday?" → step-back: "What is the general refund policy?" Useful when specific questions require background context that wouldn't be retrieved by the specific query alone.

4. Multi-query: generate 3-5 paraphrases of the original question, retrieve on each, then merge and deduplicate results. Increases recall — if one phrasing misses, another might hit.

5. Query decomposition (for complex questions): break "Compare the pricing of product A and product B and tell me which is better value" into two sub-queries: "pricing of product A" and "pricing of product B". Retrieve separately, then synthesise.

When to use each: HyDE and multi-query add latency (extra LLM calls) but improve recall significantly. Use them when retrieval quality is the bottleneck. Step-back is best for technical or procedural questions. Decomposition is essential for comparison and multi-part questions.`,
              code: `# Query transformation implementations

def query_rewrite(original_query: str, chat_history: list = None) -> str:
    """
    Rewrite the query to be standalone and retrieval-friendly.
    In practice: one LLM call with a rewriting prompt.
    """
    # Simplified rule-based version for demo
    rewrites = {
        "tell me more": "Provide additional details about the previous topic",
        "what about pricing": "What is the pricing structure and cost breakdown",
        "how does it work": "Explain the technical mechanism and implementation details",
    }
    lower = original_query.lower()
    for fragment, rewrite in rewrites.items():
        if fragment in lower:
            return rewrite
    return original_query  # No rewrite needed

def hyde(question: str, llm_generate) -> str:
    """
    Hypothetical Document Embeddings:
    Generate a fake answer, retrieve on the fake answer's embedding.
    """
    hyde_prompt = f"""Write a short factual paragraph that would be a good answer to:
"{question}"
Do not say you don't know. Write a plausible answer even if uncertain."""

    hypothetical_doc = llm_generate(hyde_prompt)  # Small LLM call
    return hypothetical_doc  # Embed this instead of the original question

def multi_query(question: str, llm_generate, n=3) -> list:
    """
    Generate n paraphrases, retrieve on each, merge results.
    """
    paraphrase_prompt = f"""Generate {n} different ways to ask this question.
Output one per line, no numbering:
Question: {question}"""

    raw = llm_generate(paraphrase_prompt)
    queries = [q.strip() for q in raw.strip().split("\\n") if q.strip()]
    queries.append(question)  # Always include original
    return queries[:n+1]

def decompose_query(question: str, llm_generate) -> list:
    """Break complex questions into atomic sub-queries"""
    decompose_prompt = f"""Break this question into simple, independent sub-questions.
Each sub-question should be answerable independently.
Output one per line:
Question: {question}"""

    raw = llm_generate(decompose_prompt)
    return [q.strip() for q in raw.strip().split("\\n") if q.strip()]

# Demo with stub LLM
def stub_llm(prompt):
    if "paraphrase" in prompt.lower() or "ways to ask" in prompt.lower():
        return "What are the pricing tiers\\nHow much does it cost\\nWhat is the subscription price"
    if "break" in prompt.lower() or "sub-question" in prompt.lower():
        return "What are the features of plan A\\nWhat are the features of plan B\\nWhich plan has better value"
    return "The pricing starts at $10/month for the basic tier and $50/month for pro."

q = "compare plan A and plan B and tell me which is better value"
print("Original:", q)
print()
print("Multi-query variants:")
for variant in multi_query(q, stub_llm):
    print(f"  - {variant}")
print()
print("Decomposed:")
for sub in decompose_query(q, stub_llm):
    print(f"  - {sub}")
print()
print("HyDE hypothetical doc:", hyde("What is the refund policy?", stub_llm)[:80] + "...")`
            },
            {
              title: "Reranking — fixing the retrieval ranking problem",
              body: `Vector search retrieves the k most semantically similar documents, but semantic similarity is not the same as relevance. A chunk mentioning the same topic as your query may not actually answer it. Rerankers re-score retrieved chunks against the specific query for relevance, not just similarity.

Why reranking matters: embedding models are trained for general semantic similarity. They're fast (embed once per doc, query at lookup time) but imprecise. Cross-encoder rerankers process the query and document together — the model sees both simultaneously and can assess their precise relationship. Much slower but much more accurate.

The two-stage retrieval pipeline:
1. Retrieve (recall): get top-k candidates with vector/hybrid search. k is large (50-100) to maximise recall. Speed matters here — sub-100ms.
2. Rerank (precision): score each candidate against the query with a cross-encoder. Return top-n (n << k, typically 3-5). Latency is secondary — quality matters.

Reranking models:
— Cohere Rerank: commercial API. Best quality, easiest to use.
— BGE Reranker (open-source): good quality, can self-host.
— cross-encoder/ms-marco-MiniLM-L-6-v2 (HuggingFace): small, fast, free.
— LLM-as-reranker: prompt an LLM to score relevance 1-10 for each chunk. Highest quality but expensive and slow.

Reciprocal Rank Fusion (RRF): when you have multiple retrieval results (e.g. vector search + BM25), RRF merges their rankings without needing scores. Each document gets score = sum(1 / (rank + k)) across all lists. k=60 is standard. Simple and surprisingly effective.

Compression after reranking: even after reranking, chunks may contain irrelevant sentences. A contextual compression step (another LLM call) extracts only the sentences from each chunk that are relevant to the query. Reduces context size, improves answer quality.`,
              code: `# Reranking pipeline with RRF and cross-encoder simulation

def reciprocal_rank_fusion(result_lists: list, k: int = 60) -> list:
    """
    Merge multiple ranked result lists into one.
    result_lists: list of lists, each list is ranked results (best first).
    k: constant to prevent high-rank dominance (60 is standard).
    """
    scores = {}
    for result_list in result_lists:
        for rank, doc_id in enumerate(result_list):
            if doc_id not in scores:
                scores[doc_id] = 0.0
            scores[doc_id] += 1.0 / (rank + k)

    # Sort by score descending
    return sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

def cross_encoder_rerank(query: str, candidates: list) -> list:
    """
    Cross-encoder sees query + document together.
    Returns candidates sorted by relevance score.
    In practice: load a cross-encoder model and score each pair.
    """
    def score_pair(q, doc):
        # Stub: real impl uses transformers cross-encoder
        # High score = highly relevant
        q_words = set(q.lower().split())
        doc_words = set(doc.lower().split())
        overlap = len(q_words & doc_words)
        # Simulate: cross-encoder rewards semantic alignment, not just overlap
        bonus = 2 if any(w in doc.lower() for w in ["policy", "refund", "return"]) else 0
        return overlap + bonus

    scored = [(doc, score_pair(query, doc)) for doc in candidates]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [doc for doc, _ in scored]

def full_retrieval_pipeline(query: str, initial_k: int = 20, final_n: int = 3):
    print(f"Query: {query}\\n")

    # Stage 1a: vector search (top-20)
    vector_results = [f"doc_{i}" for i in [3,7,1,12,5,9,2,15,8,4]]

    # Stage 1b: BM25 keyword search (top-20)
    bm25_results = [f"doc_{i}" for i in [7,3,11,5,1,14,9,6,2,13]]

    print(f"Vector top-5: {vector_results[:5]}")
    print(f"BM25 top-5:   {bm25_results[:5]}")

    # Stage 2: RRF merge
    fused = reciprocal_rank_fusion([vector_results, bm25_results])
    print(f"After RRF:    {fused[:5]}")

    # Stage 3: rerank top-20 fused results to get final top-3
    candidates = [f"Document content for {doc_id} about {query}" for doc_id in fused[:initial_k]]
    reranked = cross_encoder_rerank(query, candidates)

    print(f"\\nFinal top-{final_n} after reranking:")
    for i, doc in enumerate(reranked[:final_n], 1):
        print(f"  {i}. {doc[:60]}...")

    return reranked[:final_n]

full_retrieval_pipeline("refund policy for digital products", initial_k=10, final_n=3)`
            },
            {
              title: "Multi-hop RAG — answering questions that require chaining",
              body: `Basic RAG retrieves once and answers. Multi-hop RAG retrieves, uses the retrieved information to form a new query, retrieves again, and chains results. This handles questions where the answer requires connecting multiple pieces of information.

Example: "What programming language is used by the team that maintains the payment service?"
— Hop 1: query = "payment service team" → retrieves: "Payment service is maintained by the Platform team"
— Hop 2: query = "Platform team programming language" → retrieves: "Platform team uses Go for backend services"
— Answer: The Platform team uses Go.

Neither hop alone answers the question. You need the intermediate result from hop 1 to form the hop 2 query.

Patterns for multi-hop:

Iterative retrieval: after retrieving and partially answering, ask the LLM "what additional information do I still need?" and retrieve again. Loop until the LLM says it has enough. Simple but unpredictable — can loop forever or ask irrelevant follow-ups.

Decompose-then-retrieve: break the question into sub-questions upfront (query decomposition), retrieve for each independently, then synthesise. More predictable, but misses cases where sub-questions depend on each other.

IRCoT (Interleaving Retrieval with Chain-of-Thought): interleave reasoning steps with retrieval. Each reasoning step may trigger a retrieval, and retrieved information informs the next reasoning step. Most powerful but most complex to implement.

When multi-hop fails: the biggest failure mode is query drift — the retrieved chunks from hop 1 are slightly off-topic, leading hop 2 to retrieve on the wrong premise, compounding the error. Add a verification step after each hop: "Is this retrieved information actually relevant to my current reasoning step?"

Production consideration: each hop adds 1-2 LLM calls and 1 retrieval. A 3-hop query can take 3-5x longer than a basic RAG query. Add a classifier at the front to route simple queries to basic RAG and only use multi-hop for complex ones.`,
              code: `# Multi-hop RAG — iterative retrieval with reasoning

class MultiHopRAG:
    def __init__(self, retriever, llm):
        self.retriever = retriever
        self.llm = llm
        self.max_hops = 3

    def retrieve_and_reason(self, question: str) -> str:
        context_so_far = ""
        queries_made = []

        for hop in range(self.max_hops):
            # Ask LLM: given what we know so far, what should we search for?
            if hop == 0:
                search_query = question
            else:
                search_prompt = f"""Question: {question}

Context retrieved so far:
{context_so_far}

What specific information do you still need to fully answer the question?
Write a search query to find that information, or write DONE if you have enough."""

                next_query = self.llm(search_prompt)
                if "DONE" in next_query.upper():
                    break
                search_query = next_query

            # Retrieve
            results = self.retriever(search_query)
            queries_made.append(search_query)
            context_so_far += f"\\n[Hop {hop+1} - Query: {search_query}]\\n"
            context_so_far += "\\n".join(results)
            context_so_far += "\\n"
            print(f"Hop {hop+1}: searched '{search_query[:50]}', got {len(results)} chunks")

        # Final answer synthesis
        final_prompt = f"""Answer this question using the retrieved context.

Question: {question}

Retrieved context:
{context_so_far}

Answer:"""

        return self.llm(final_prompt), queries_made

# Stub implementations for demo
knowledge_base = {
    "payment service": ["Payment service is maintained by the Platform team (founded 2019)"],
    "Platform team": ["Platform team uses Go for backend, TypeScript for tooling"],
    "Platform team language": ["Platform engineers primarily write Go; some Python for scripts"],
    "refund policy": ["Refunds processed within 5 business days to original payment method"],
}

def stub_retriever(query: str) -> list:
    query_lower = query.lower()
    for key, docs in knowledge_base.items():
        if key.lower() in query_lower:
            return docs
    return ["No relevant documents found for: " + query]

def stub_llm(prompt: str) -> str:
    if "still need" in prompt:
        if "Platform team" in prompt and "language" not in prompt:
            return "Platform team programming language"
        return "DONE"
    if "Answer:" in prompt:
        return "The Platform team maintains the payment service and uses Go."
    return "Generic LLM response"

rag = MultiHopRAG(stub_retriever, stub_llm)
answer, hops = rag.retrieve_and_reason(
    "What programming language is used by the team that maintains the payment service?"
)
print(f"\\nFinal answer: {answer}")
print(f"Queries made: {hops}")`
            }
          ],
          quiz: [
            {
              q: "What is HyDE and why does it improve retrieval quality?",
              options: ["A compression technique", "Generate a hypothetical answer and embed it for retrieval — the fake answer shares vocabulary with real answers unlike the original question phrasing", "A reranking algorithm", "A chunking strategy"],
              answer: 1,
              explain: "Questions and answers often use different vocabulary ('What causes X?' vs 'X is caused by...'). Embedding the question retrieves documents semantically similar to a question. Embedding a hypothetical answer retrieves documents similar to an answer — which is what you actually want. HyDE consistently improves recall on factual queries."
            },
            {
              q: "What is the key difference between a bi-encoder (used in vector search) and a cross-encoder (used in reranking)?",
              options: ["Bi-encoders are more accurate", "Bi-encoder embeds query and document separately; cross-encoder processes them together and is more accurate but much slower", "Cross-encoders can't handle long documents", "They produce the same scores"],
              answer: 1,
              explain: "Bi-encoders embed query and document independently — fast because document embeddings are precomputed. Cross-encoders see both simultaneously, allowing deep interaction — far more accurate but must run at query time for every candidate. The two-stage pattern uses bi-encoders for recall and cross-encoders for precision."
            },
            {
              q: "When does basic single-hop RAG fail and multi-hop RAG is needed?",
              options: ["When documents are too long", "When the answer requires connecting information from multiple documents that wouldn't all be retrieved by the original query", "When the vector database is too large", "When using BM25 instead of vector search"],
              answer: 1,
              explain: "Single-hop RAG retrieves once based on the original question. If the answer requires chaining (e.g., 'who owns the company that makes X'), the first retrieval returns the manufacturer, and only a second retrieval (using that result) can find the owner. Basic RAG can't do this — it would need both facts in a single chunk."
            }
          ],
          starter: `# Implement Reciprocal Rank Fusion from scratch and test it

def rrf_score(rank: int, k: int = 60) -> float:
    """RRF score for a document at a given rank position"""
    return 1.0 / (rank + k)

def reciprocal_rank_fusion(ranked_lists: list, k: int = 60) -> list:
    """
    Merge multiple ranked result lists.
    ranked_lists: list of lists, each sorted best-first.
    Returns: list of (doc_id, score) sorted best-first.
    """
    scores = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list):
            scores[doc_id] = scores.get(doc_id, 0) + rrf_score(rank, k)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Simulate two retrieval systems
vector_results = ["doc_A", "doc_C", "doc_E", "doc_B", "doc_D"]  # Vector search ranking
bm25_results   = ["doc_B", "doc_A", "doc_F", "doc_C", "doc_G"]  # BM25 ranking

print("Vector search ranking:", vector_results)
print("BM25 ranking:         ", bm25_results)
print()

fused = reciprocal_rank_fusion([vector_results, bm25_results])
print("RRF merged ranking:")
for rank, (doc, score) in enumerate(fused, 1):
    print(f"  {rank}. {doc}: {score:.4f}")

print()
print("Insight: doc_A ranked 1st in vector and 2nd in BM25 → highest fused score")
print("doc_B ranked 4th in vector and 1st in BM25 → benefits from BM25 top rank")
print()

# Try with 3 retrieval systems
semantic_results = ["doc_H", "doc_A", "doc_C", "doc_I", "doc_B"]
three_way = reciprocal_rank_fusion([vector_results, bm25_results, semantic_results])
print("3-way fusion top 5:")
for rank, (doc, score) in enumerate(three_way[:5], 1):
    print(f"  {rank}. {doc}: {score:.4f}")
`
        },
        {
          id: "evals-observability",
          title: "Evals & Observability",
          tag: "senior",
          summary: "You can't improve what you can't measure. Production LLM systems require evaluation pipelines, tracing, and monitoring — this is what separates a demo from a reliable product.",
          concepts: [
            {
              title: "The evaluation hierarchy — unit tests to production monitoring",
              body: `LLM evaluation is harder than traditional software testing because outputs are probabilistic and subjective. There is no assertEqual for a paragraph of text. You need a layered evaluation strategy that catches problems at multiple levels.

The four layers:

1. Unit evals (offline, automated): deterministic checks on specific behaviours. Does the model refuse to answer out-of-scope questions? Does it always return valid JSON when asked? Does it stay under the token budget? These run in CI on every code change. Fast and cheap.

2. Model-graded evals (offline): use an LLM (GPT-4, Claude) to grade your model's outputs against criteria. "Score this response 1-5 for accuracy, helpfulness, and safety." Can evaluate subjective qualities at scale. Cost: ~$0.01-0.05 per evaluation call. Requires its own validation — the grader LLM can be wrong or biased.

3. Human evals (offline, periodic): human raters compare outputs (A/B), assign quality scores, or validate specific examples. Most accurate but most expensive ($0.50-$5/example). Run before major releases, not on every change.

4. Production monitoring (online): track metrics on real traffic. Latency, cost, error rate, user feedback (thumbs up/down), topic distribution. Alert on anomalies. This is your ground truth — everything else is a proxy.

The evaluation dataset is your most valuable asset. Build a "golden set" of 100-500 examples with known correct answers and expected behaviours. Every model change, prompt change, or retrieval change gets run against this set. Track scores over time — any regression is caught before it reaches users.

Goodhart's Law applied to LLM evals: when a measure becomes a target, it ceases to be a good measure. If you optimise purely for LLM-grader scores, you'll find prompts that score well but aren't actually good. Always cross-validate with human evals and user feedback.`,
              code: `# Evaluation framework structure

from dataclasses import dataclass
from typing import Callable
import statistics

@dataclass
class EvalCase:
    id: str
    input: str
    expected: str          # Ground truth or expected pattern
    category: str          # e.g. "factual", "refusal", "format"
    metadata: dict = None

@dataclass
class EvalResult:
    case_id: str
    score: float           # 0.0 to 1.0
    passed: bool
    details: str

class Evaluator:
    def __init__(self, name: str, scorer: Callable):
        self.name = name
        self.scorer = scorer  # fn(case, actual_output) → EvalResult

    def run(self, cases: list, model_fn: Callable) -> dict:
        results = []
        for case in cases:
            actual = model_fn(case.input)
            result = self.scorer(case, actual)
            results.append(result)

        scores = [r.score for r in results]
        by_category = {}
        for case, result in zip(cases, results):
            cat = case.category
            by_category.setdefault(cat, []).append(result.score)

        return {
            "mean_score": statistics.mean(scores),
            "pass_rate": sum(r.passed for r in results) / len(results),
            "by_category": {cat: statistics.mean(s) for cat, s in by_category.items()},
            "results": results
        }

# Exact match scorer — for factual questions with known answers
def exact_match_scorer(case: EvalCase, actual: str) -> EvalResult:
    passed = case.expected.lower() in actual.lower()
    return EvalResult(
        case_id=case.id,
        score=1.0 if passed else 0.0,
        passed=passed,
        details=f"Expected '{case.expected}' in output"
    )

# Format scorer — does output match expected structure?
def json_format_scorer(case: EvalCase, actual: str) -> EvalResult:
    import json
    try:
        parsed = json.loads(actual)
        # Check required keys
        required = case.metadata.get("required_keys", []) if case.metadata else []
        missing = [k for k in required if k not in parsed]
        passed = len(missing) == 0
        return EvalResult(case.id, 1.0 if passed else 0.5, passed,
                         f"Missing keys: {missing}" if missing else "Valid JSON with all required keys")
    except json.JSONDecodeError as e:
        return EvalResult(case.id, 0.0, False, f"Invalid JSON: {e}")

# Test
cases = [
    EvalCase("q1", "What is the capital of France?", "Paris", "factual"),
    EvalCase("q2", "What is 2+2?", "4", "factual"),
    EvalCase("q3", "Return JSON with name and age", "", "format",
             {"required_keys": ["name", "age"]}),
]

def stub_model(prompt):
    responses = {
    "What is the capital of France?": "The capital of France is Paris.",
    "What is 2+2?": "2+2 equals 5.",  # Wrong!
    "Return JSON with name and age": '{"name": "Alice", "age": 30}',
    }
    return responses.get(prompt, "I don't know")

eval_factual = Evaluator("exact_match", exact_match_scorer)
results = eval_factual.run(cases[:2], stub_model)
print(f"Factual eval — pass rate: {results['pass_rate']:.0%}, mean score: {results['mean_score']:.2f}")
for r in results['results']:
    print(f"  {r.case_id}: {'PASS' if r.passed else 'FAIL'} — {r.details}")`
            },
            {
              title: "LLM-as-judge — automated quality scoring at scale",
              body: `Model-graded evaluation (LLM-as-judge) is the most scalable way to evaluate subjective qualities like helpfulness, accuracy, tone, and safety. Instead of writing rules, you write rubrics and have a capable LLM apply them.

The three judging patterns:

1. Pointwise scoring: give the judge an output and ask it to score on a rubric (e.g. 1-5 for accuracy). Simple, but scores from different calls aren't always comparable.

2. Reference-based grading: give the judge the output and the reference answer. "Given this reference answer, how accurate is the model's response?" Much more reliable than pointwise.

3. Pairwise comparison (preference): give the judge two outputs and ask which is better. "Which response is more accurate and helpful: A or B?" Humans are better at relative judgement than absolute — models are too. More reliable, but O(n²) to compare all pairs.

Prompt design for the judge:
— Be specific about your criteria. "Is this accurate?" is too vague. "Does this response correctly state the refund window as 30 days?" is evaluatable.
— Use a structured output format (JSON with scores and reasoning). The reasoning forces the model to justify, which improves accuracy.
— Include examples of good and bad responses (few-shot) in the judge prompt.
— Ask for chain-of-thought before the score.

Pitfalls:
— Verbosity bias: LLM judges prefer longer responses even when shorter is better. Control for this in your rubric.
— Self-serving bias: a model grades its own outputs higher. Always use a different model as judge when possible.
— Position bias: in pairwise, judges often prefer whichever response was listed first. Mitigate by running both orderings and averaging.
— Calibration drift: your judge model changes when the API provider updates it. Pin to specific model versions for reproducibility.`,
              code: `# LLM-as-judge implementation patterns

def build_judge_prompt(question: str, response: str, reference: str = None) -> str:
    """Reference-based judge prompt with structured output"""
    ref_section = f"""
Reference answer (ground truth):
{reference}
""" if reference else ""

    return f"""You are evaluating an AI assistant's response for quality.

Question asked: {question}
{ref_section}
Response to evaluate:
{response}

Evaluate on these criteria:
1. Accuracy (0-3): Does the response contain correct information?
   0 = factually wrong, 1 = partially correct, 2 = mostly correct, 3 = fully correct
2. Completeness (0-2): Does it fully answer the question?
   0 = misses the point, 1 = partially answers, 2 = fully answers
3. Conciseness (0-1): Is it appropriately concise without unnecessary padding?
   0 = too verbose or too brief, 1 = appropriate length

Think step by step, then output JSON:
{{
  "reasoning": "your analysis here",
  "accuracy": <0-3>,
  "completeness": <0-2>,
  "conciseness": <0-1>,
  "total": <sum>,
  "max_possible": 6
}}"""

def parse_judge_output(raw: str) -> dict:
    """Extract JSON from judge output (handles markdown code blocks)"""
    import json, re
    # Strip markdown code fences if present
    raw = re.sub(r'\`\`\`(?:json)?\\s*', '', raw).strip('\`').strip()
    # Find the JSON object
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if not match:
        return {"error": "No JSON found", "total": 0, "max_possible": 6}
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {"error": "Invalid JSON", "total": 0, "max_possible": 6}

def run_judge_eval(test_cases: list, model_fn, judge_fn) -> dict:
    """Run judge eval across a test set and aggregate"""
    all_scores = []
    for case in test_cases:
        response = model_fn(case["question"])
        judge_prompt = build_judge_prompt(
            case["question"], response, case.get("reference")
        )
        raw_judgment = judge_fn(judge_prompt)
        judgment = parse_judge_output(raw_judgment)

        score = judgment.get("total", 0)
        max_score = judgment.get("max_possible", 6)
        all_scores.append(score / max_score)
        print(f"Q: {case['question'][:40]}...")
        print(f"   Score: {score}/{max_score} — {judgment.get('reasoning', '')[:60]}...")

    return {
        "mean_normalised_score": sum(all_scores) / len(all_scores),
        "n": len(all_scores)
    }

# Demo with stubs
test_cases = [
    {"question": "What is the refund window?", "reference": "30 days from purchase date"},
    {"question": "How do I cancel my subscription?", "reference": "Go to Settings > Billing > Cancel"},
]

def stub_model(q): return "You can get a refund within 30 days of your purchase."
def stub_judge(prompt):
    return '{"reasoning": "Response correctly states the 30-day window", "accuracy": 3, "completeness": 2, "conciseness": 1, "total": 6, "max_possible": 6}'

results = run_judge_eval(test_cases[:1], stub_model, stub_judge)
print(f"\\nMean score: {results['mean_normalised_score']:.1%}")`
            },
            {
              title: "Tracing and production observability",
              body: `A production LLM application is a chain of operations — retrieval, reranking, prompt construction, LLM call, output parsing. When something goes wrong, you need to know which step failed. Tracing gives you visibility into every step of every request.

What to trace per request:
— Input (user query, session ID, user ID)
— Each step: name, input, output, latency, token count, cost
— Final output
— User feedback (if collected)
— Any errors or fallbacks triggered

Trace granularity: trace at the span level (one span per logical operation). A single user request might have spans for: query_rewrite, retrieve, rerank, prompt_build, llm_call, output_parse. The total request trace = sum of all spans. This lets you identify bottlenecks (which span is slow?) and quality issues (which span produces garbage?).

Key metrics to dashboard:
— Latency: P50, P95, P99 per step and end-to-end. P99 shows your worst-case user experience.
— Token usage: prompt tokens, completion tokens, cost per request, cost per user.
— Error rate: LLM errors, retrieval errors, timeout rate.
— Quality proxies: retrieval score distribution, LLM self-reported confidence, output length.
— User signals: explicit (thumbs up/down), implicit (follow-up questions = confusion, session end = satisfaction or frustration).

Tooling in practice:
— LangSmith (LangChain's platform): purpose-built for LLM tracing. Auto-instruments LangChain apps.
— Langfuse: open-source alternative to LangSmith. Self-hostable.
— Arize AI / WhyLabs: ML observability platforms with LLM support.
— OpenTelemetry: standard instrumentation, integrates with Datadog/Grafana for teams already using those.
— DIY: log structured JSON to your existing log aggregator. Good enough for early-stage.

Alerting rules to set up immediately:
— Error rate > 1% in 5-minute window
— P99 latency > 10s
— Cost per hour > X (prevents runaway bills)
— LLM refusal rate > threshold (model may be over-refusing)`,
              code: `# Structured tracing implementation

import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Span:
    name: str
    trace_id: str
    span_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    parent_id: Optional[str] = None
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    input: Optional[str] = None
    output: Optional[str] = None
    metadata: dict = field(default_factory=dict)
    error: Optional[str] = None

    @property
    def duration_ms(self):
        if self.end_time:
            return round((self.end_time - self.start_time) * 1000, 1)
        return None

class Tracer:
    def __init__(self):
        self.traces = {}

    def start_trace(self, name: str) -> str:
        trace_id = str(uuid.uuid4())[:8]
        self.traces[trace_id] = {"root": name, "spans": []}
        return trace_id

    @contextmanager
    def span(self, trace_id: str, name: str, input_data=None, parent_id=None):
        s = Span(name=name, trace_id=trace_id, input=str(input_data)[:100] if input_data else None, parent_id=parent_id)
        try:
            yield s
            s.end_time = time.time()
        except Exception as e:
            s.error = str(e)
            s.end_time = time.time()
            raise
        finally:
            self.traces[trace_id]["spans"].append(s)

    def print_trace(self, trace_id: str):
        trace = self.traces.get(trace_id, {})
        spans = trace.get("spans", [])
        total_ms = sum(s.duration_ms or 0 for s in spans)
        print(f"\\nTrace {trace_id} — {len(spans)} spans, {total_ms:.0f}ms total")
        print("-" * 60)
        for s in spans:
            status = "ERR" if s.error else "OK "
            indent = "  " if s.parent_id else ""
            print(f"  {status} {indent}{s.name:<25} {s.duration_ms:>6}ms")
            if s.metadata:
                for k, v in s.metadata.items():
                    print(f"       {indent}  {k}: {v}")

tracer = Tracer()

def traced_rag_pipeline(query: str):
    trace_id = tracer.start_trace("rag_request")

    with tracer.span(trace_id, "query_rewrite", query) as s:
        time.sleep(0.05)  # Simulate LLM call
        rewritten = f"Rewritten: {query}"
        s.output = rewritten
        s.metadata = {"model": "gpt-4o-mini", "tokens": 45}

    with tracer.span(trace_id, "retrieve", rewritten) as s:
        time.sleep(0.08)
        chunks = ["chunk_1", "chunk_2", "chunk_3"]
        s.output = str(chunks)
        s.metadata = {"k": 20, "index": "prod-v3", "top_score": 0.87}

    with tracer.span(trace_id, "rerank", chunks) as s:
        time.sleep(0.12)
        reranked = chunks[:3]
        s.output = str(reranked)
        s.metadata = {"model": "bge-reranker-v2", "candidates": 20}

    with tracer.span(trace_id, "llm_generate", reranked) as s:
        time.sleep(0.35)
        answer = "Based on the context, the answer is..."
        s.output = answer[:50]
        s.metadata = {"model": "gpt-4o", "prompt_tokens": 812, "completion_tokens": 94,
                      "cost_usd": 0.0045}

    tracer.print_trace(trace_id)
    return answer

traced_rag_pipeline("What is the refund policy for enterprise customers?")`
            }
          ],
          quiz: [
            {
              q: "What is the main advantage of pairwise comparison (A vs B) over pointwise scoring (score A 1-5) in LLM evaluation?",
              options: ["It is cheaper to run", "Humans and LLMs are more reliable at relative judgements (A is better than B) than absolute quality scores on a numeric scale", "It requires no reference answers", "It works without an LLM judge"],
              answer: 1,
              explain: "Calibrating what '3 out of 5' means is hard and inconsistent across raters and calls. Asking 'which is better?' is more reliable — it removes the calibration problem. The tradeoff is cost: comparing n outputs pairwise requires O(n²) comparisons vs O(n) for pointwise."
            },
            {
              q: "What is verbosity bias in LLM-as-judge evaluation, and how do you mitigate it?",
              options: ["The judge refuses to evaluate long responses", "LLM judges tend to score longer responses higher regardless of quality; mitigate by explicitly including conciseness as a criterion and testing with matched-length pairs", "Judges only work on short prompts", "Verbose prompts cost more to evaluate"],
              answer: 1,
              explain: "LLM judges conflate length with thoroughness — a long but wrong answer often scores higher than a concise correct one. Mitigation: add an explicit conciseness criterion in your rubric, test with length-matched pairs, and periodically validate judge scores against human ratings."
            },
            {
              q: "Why should you trace at the span level (one span per operation) rather than just logging the final input/output?",
              options: ["Spans use less storage", "Span-level tracing shows which specific step (retrieval, reranking, LLM call) is slow or producing bad output — without it you can't localise the problem", "Final output logging is not allowed", "LLMs require span-level input"],
              answer: 1,
              explain: "A RAG pipeline has 5-8 steps. If quality is bad or latency is high, you need to know which step. Final input/output logging tells you there's a problem but not where. Span tracing shows you that retrieval took 2s (slow index), or the reranker dropped the right chunk, or the LLM hallucinated despite good context."
            }
          ],
          starter: `# Build a simple evaluation harness with scoring and reporting

def evaluate_rag_system(test_cases, rag_fn, judge_fn=None):
    """
    Run a RAG system against test cases and report results.
    test_cases: list of dicts with 'question', 'reference', 'category'
    rag_fn: fn(question) -> answer string
    judge_fn: optional fn(question, answer, reference) -> score 0-1
    """
    results = []

    for case in test_cases:
        # Get the system's answer
        answer = rag_fn(case["question"])

        # Score it
        if judge_fn:
            score = judge_fn(case["question"], answer, case.get("reference", ""))
        else:
            # Fallback: keyword overlap as a proxy
            ref_words = set(case.get("reference", "").lower().split())
            ans_words = set(answer.lower().split())
            score = len(ref_words & ans_words) / max(len(ref_words), 1)

        results.append({
            "question": case["question"],
            "category": case.get("category", "general"),
            "answer": answer,
            "score": score,
        })

    # Aggregate
    overall = sum(r["score"] for r in results) / len(results)
    by_cat = {}
    for r in results:
        by_cat.setdefault(r["category"], []).append(r["score"])

    print(f"=== Evaluation Report ===")
    print(f"Total cases: {len(results)}")
    print(f"Overall score: {overall:.1%}")
    print()
    print("By category:")
    for cat, scores in by_cat.items():
        print(f"  {cat}: {sum(scores)/len(scores):.1%} ({len(scores)} cases)")
    print()
    print("Worst performing cases:")
    for r in sorted(results, key=lambda x: x["score"])[:3]:
        print(f"  Score {r['score']:.1%}: {r['question'][:60]}")

    return results

# Test with stub data
test_cases = [
    {"question": "What is the refund window?", "reference": "30 days", "category": "policy"},
    {"question": "How do I cancel?", "reference": "Settings > Billing > Cancel", "category": "how-to"},
    {"question": "What payment methods are accepted?", "reference": "Visa Mastercard PayPal", "category": "policy"},
    {"question": "Is there a free trial?", "reference": "14-day free trial available", "category": "pricing"},
]

def stub_rag(question):
    answers = {
        "What is the refund window?": "We offer refunds within 30 days of purchase.",
        "How do I cancel?": "You can cancel from the billing section in your account.",
        "What payment methods are accepted?": "We accept all major credit cards.",
        "Is there a free trial?": "Yes, there is a trial period available.",
    }
    return answers.get(question, "I don't have that information.")

evaluate_rag_system(test_cases, stub_rag)
`
        }
      ]
    },
    {
      id: "system-design",
      title: "System Design",
      icon: "⬡",
      color: "#FDE68A",
      desc: "The hardest gap for self-taught engineers — learn to think in trade-offs",
      lessons: [
        {
          id: "ai-system-design",
          title: "AI System Design",
          tag: "must know",
          summary: "You've built real systems. Now learn to explain them at the architecture level — trade-offs, scale, failure modes.",
          concepts: [
            {
              title: "The system design interview framework",
              body: `System design interviews test your ability to think in trade-offs, not your ability to produce a perfect architecture. The structure of your answer matters as much as the content. Interviewers reward candidates who clarify before designing.

The five-step framework:
1. Clarify requirements (2-3 min): functional requirements (what it does) and non-functional requirements (scale, latency, availability). Never assume — ask.
2. Estimate scale (1-2 min): QPS, data volume, storage needs, bandwidth. Back-of-envelope numbers ground the discussion.
3. High-level design (5 min): boxes and arrows. Name the components without over-specifying.
4. Deep dive (10 min): pick the 1-2 most interesting/complex components and go deep. Let the interviewer guide.
5. Trade-offs and failure modes (3 min): what doesn't work, what you'd change at 10x scale.

Key questions to always ask:
— "What is the expected QPS / requests per second?"
— "What is the latency requirement? p99 < X ms?"
— "What is the consistency requirement? Can we tolerate eventual consistency?"
— "Is this read-heavy or write-heavy?"
— "What's the scale — hundreds of users or millions?"

For AI systems specifically: "What is the acceptable latency for inference?" and "Is accuracy more important than latency?" are critical differentiators between architectures.`,
              code: `# System design is verbal + diagramming — code models the thinking

def estimate_scale(qps, avg_latency_ms, storage_per_req_kb=0):
    """Back-of-envelope calculations — do this in every interview"""
    concurrent = qps * (avg_latency_ms / 1000)
    daily_requests = qps * 86_400
    daily_storage_gb = (daily_requests * storage_per_req_kb) / (1024 * 1024)

    print(f"QPS: {qps:,}")
    print(f"Concurrent requests: {concurrent:.0f}")
    print(f"Daily requests: {daily_requests:,}")
    if storage_per_req_kb:
        print(f"Daily storage: {daily_storage_gb:.1f} GB")
        print(f"Monthly storage: {daily_storage_gb*30:.0f} GB")

print("=== Real-time AI assistant at medium scale ===")
estimate_scale(qps=100, avg_latency_ms=800, storage_per_req_kb=2)

print("\\n=== RAG system at large scale ===")
estimate_scale(qps=1000, avg_latency_ms=300, storage_per_req_kb=0.5)

# Key clarifying questions for AI system design:
CLARIFYING_QUESTIONS = [
    "What latency is acceptable? (p50? p99?)",
    "Real-time streaming or batch inference?",
    "What's the context window size needed?",
    "How often does the knowledge base update?",
    "What's the acceptable hallucination rate?",
    "On-premise or cloud? Cost constraints?",
]
for q in CLARIFYING_QUESTIONS:
    print(f"  • {q}")`
            },
            {
              title: "Design: real-time LLM pipeline",
              body: `This is the canonical AI engineering system design question. The goal is to build a system where a user speaks, the AI processes, and a response is generated in under 1.5 seconds. Each component has a latency budget.

Latency budget breakdown (1500ms total):
— ASR (speech → text): 150-250ms with Deepgram/Whisper streaming
— LLM time-to-first-token: 300-500ms (GPT-4o, Claude Haiku)
— TTS first audio chunk: 150-300ms (ElevenLabs, Cartesia)
— Network + buffering: 100-200ms

The critical architectural decision: stream everywhere. Don't wait for the complete LLM response before starting TTS. Pipe tokens from LLM → TTS as they arrive. This reduces perceived latency from 2-3 seconds to under 1 second for the user to hear the first word.

State management: conversation history must be stored and retrieved per call. Redis is the right choice — sub-millisecond reads, TTL for auto-cleanup, and it handles concurrent calls naturally. Don't use a relational DB for hot conversation state.

Reliability patterns: every external dependency (ASR provider, LLM provider, TTS provider) can fail. Design fallbacks at every layer: primary ASR → fallback ASR, primary LLM → fallback LLM, LLM → cached response for common queries. A circuit breaker prevents cascading failures.`,
              code: `# Real-time telephony AI pipeline — system design articulation

PIPELINE_DESIGN = {
    "components": {
        "ingestion":   "WebSocket server (bidirectional, low-latency)",
        "asr":         "Deepgram streaming (primary) / Whisper (fallback)",
        "context":     "Redis — conversation state, TTL=1hr per call",
        "llm":         "GPT-4o streaming (primary) / Claude Haiku (fallback)",
        "tts":         "Cartesia (primary) / ElevenLabs (fallback)",
        "analytics":   "Async write to Postgres — non-blocking"
    },
    "latency_budget_ms": {
        "asr":       200,
        "llm_ttft":  400,   # time to first token
        "tts_first": 200,
        "network":   150,
        "total":    1500    # p99 target
    },
    "key_decisions": [
        "Stream LLM tokens to TTS immediately — don't buffer",
        "Store hot state in Redis, cold storage in Postgres",
        "Fallback chain at every provider dependency",
        "Circuit breaker: if ASR fails 3x in 30s, route to IVR",
        "Async analytics writes — never on the critical path",
    ],
    "trade_offs": [
        "WebSocket vs HTTP: chose WS for bidirectional, but adds stateful complexity",
        "Cloud ASR vs on-prem: better accuracy, vendor lock-in risk",
        "GPT-4o vs smaller model: better quality, higher cost and latency",
    ]
}

for section, items in PIPELINE_DESIGN.items():
    print(f"\\n{section.upper()}:")
    if isinstance(items, dict):
        for k, v in items.items():
            print(f"  {k}: {v}")
    else:
        for item in items:
            print(f"  • {item}")`
            },
            {
              title: "Caching strategies for LLM applications",
              body: `LLM API calls are the most expensive operation in AI applications — both in cost ($) and latency (ms). Caching is the highest-leverage optimisation available.

Exact caching: cache the exact (prompt, parameters) → response mapping. Works well when the same prompt is repeated verbatim. A simple Redis key-value store with the prompt as key. High hit rate for FAQ-style applications.

Semantic caching (GPTCache): instead of exact matching, embed the incoming query and search a vector store of past queries. If a semantically similar query was asked before (cosine similarity > threshold), return the cached response. Hit rates of 20-40% are common. The trade-off: may return slightly mismatched cached answers for similar but not identical queries.

Provider-side prompt caching: OpenAI and Anthropic both offer prompt caching — repeated system prompts are cached server-side, reducing cost (up to 90% discount on cached tokens) and latency. Structure prompts to put stable content first (system prompt, examples) and variable content last (user message). Cache only applies to the prefix.

When NOT to cache: real-time data queries, personalised responses, or any query where freshness is critical. Also, don't cache responses that might become incorrect (e.g., stock prices, availability checks).

CDN-style cache for RAG: if the same question is asked often, cache the retrieved chunks too — not just the LLM response. This avoids both the embedding call and the vector search.`,
              code: `import hashlib
import json
import time

class LLMCache:
    def __init__(self, redis_client=None, ttl_seconds=3600):
        self.store = {}   # in-memory fallback (use Redis in prod)
        self.redis = redis_client
        self.ttl = ttl_seconds
        self.hits = 0
        self.misses = 0

    def _make_key(self, prompt: str, model: str, temperature: float) -> str:
        payload = json.dumps({"prompt": prompt, "model": model, "temp": temperature})
        return hashlib.sha256(payload.encode()).hexdigest()

    def get(self, prompt, model="gpt-4", temperature=0.0):
        key = self._make_key(prompt, model, temperature)
        result = self.store.get(key)
        if result and result["expires"] > time.time():
            self.hits += 1
            return result["response"]
        self.misses += 1
        return None

    def set(self, prompt, response, model="gpt-4", temperature=0.0):
        key = self._make_key(prompt, model, temperature)
        self.store[key] = {
            "response": response,
            "expires": time.time() + self.ttl
        }

    @property
    def hit_rate(self):
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.0

cache = LLMCache()

# Simulate usage
cache.set("What time is check-in?", "Check-in is at 3 PM.")
print(cache.get("What time is check-in?"))   # cache hit
print(cache.get("What time is check-out?"))  # cache miss
print(f"Hit rate: {cache.hit_rate:.0%}")     # 50%

# Prompt caching tip: put stable content FIRST
# Anthropic/OpenAI cache prefixes — stable prefix = cached = cheaper
STABLE_SYSTEM = "You are a hotel booking assistant. " * 100   # ~700 tokens
VARIABLE_USER = "Customer: What time is check-out?"           # changes per call`
            },
            {
              title: "Reliability patterns for AI systems",
              body: `AI systems have unique reliability challenges: non-deterministic outputs, third-party API dependencies, high per-request costs, and latency variability. Standard software reliability patterns apply, but with AI-specific adaptations.

Circuit breaker: track failure rate for each external dependency (LLM API, vector DB, ASR). If failure rate exceeds threshold (e.g., 50% in last 60 seconds), open the circuit — stop sending requests and return fallback responses immediately. After a timeout, send one test request (half-open state). If it succeeds, close the circuit.

Retry with exponential backoff: for transient failures (rate limits, 429s, 503s), retry after 1s, then 2s, then 4s. Don't retry on 4xx errors (invalid request — retrying won't help). Add jitter (random offset) to prevent thundering herd when many requests fail simultaneously.

Graceful degradation: define a quality ladder. Tier 1: full pipeline (LLM + RAG + reranker). Tier 2: LLM only (no retrieval). Tier 3: cached common responses. Tier 4: static fallback ("I'm having trouble, please call back"). Each tier activates when higher tiers are unavailable.

Timeouts everywhere: every external call must have a timeout. LLM call: 30s hard timeout. Vector search: 500ms. ASR streaming: drop if no tokens in 5s. Without timeouts, one slow dependency stalls the entire pipeline.

Observability: instrument every component. Track p50/p95/p99 latency, error rate, token counts, and cost per request. Without metrics you're flying blind when things go wrong.`,
              code: `import time
import random

class CircuitBreaker:
    """Three states: CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing)"""
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.state = "CLOSED"
        self.opened_at = None

    def call(self, fn, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.opened_at > self.reset_timeout:
                self.state = "HALF_OPEN"
            else:
                raise Exception("Circuit OPEN — using fallback")

        try:
            result = fn(*args, **kwargs)
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failures = 0
            return result
        except Exception as e:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
                self.opened_at = time.time()
            raise e

def retry_with_backoff(fn, max_retries=3, base_delay=1.0):
    """Exponential backoff with jitter"""
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            delay = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
            print(f"Attempt {attempt+1} failed. Retrying in {delay:.1f}s...")
            time.sleep(delay)

# Graceful degradation tiers
def get_response_with_fallback(query, context):
    try:
        return call_llm_with_rag(query, context)   # Tier 1: full pipeline
    except Exception:
        try:
            return call_llm_only(query)             # Tier 2: LLM only
        except Exception:
            cached = check_common_responses(query)
            if cached:
                return cached                       # Tier 3: cached
            return "I'm having trouble. Please hold."  # Tier 4: static`
            }
          ],
          quiz: [
            {
              q: "In a real-time LLM pipeline, why stream the response instead of waiting for full output?",
              options: ["Streaming is cheaper", "It reduces perceived latency — user hears first words sooner even if total time is similar", "Streaming uses less memory", "Required for WebSocket connections"],
              answer: 1,
              explain: "Total generation time might be 3s either way, but streaming starts audio/text after ~500ms. The user perceives a fast response because they see/hear progress immediately. This is why ChatGPT and Claude stream — it's a UX optimisation, not a performance one."
            },
            {
              q: "What is semantic caching in an LLM application?",
              options: ["Caching the model weights", "Caching LLM responses keyed by semantic similarity — similar queries return cached responses", "Storing embeddings only", "OpenAI's built-in cache"],
              answer: 1,
              explain: "Semantic caching embeds the incoming query and searches for past similar queries. If a semantically similar question was answered before, return that cached response. Achieves 20-40% hit rates vs ~5% for exact caching in conversational apps."
            },
            {
              q: "When should a circuit breaker open?",
              options: ["On every error", "When failure rate exceeds a threshold over a time window — to stop hammering a failing dependency", "After a fixed timeout", "Only for database failures"],
              answer: 1,
              explain: "A circuit breaker monitors failure rate (e.g., 50% failures in 60 seconds). When the threshold is crossed, it 'opens' — immediately returning fallback responses instead of calling the failing service. This prevents cascading failures and gives the dependency time to recover."
            }
          ],
          starter: `# Cost estimation — a real interview skill
def estimate_monthly_cost(calls_per_day, avg_duration_seconds, words_per_second=2.5):
    ASR_PER_MIN  = 0.006    # Deepgram
    LLM_PER_1K   = 0.002    # GPT-3.5-turbo input
    TTS_PER_1K   = 0.015    # ElevenLabs chars

    calls_per_month = calls_per_day * 30
    total_minutes   = calls_per_month * avg_duration_seconds / 60
    words           = calls_per_month * avg_duration_seconds * words_per_second
    tokens          = words * 1.3

    asr  = total_minutes * ASR_PER_MIN
    llm  = tokens / 1000 * LLM_PER_1K
    tts  = words * 5 / 1000 * TTS_PER_1K   # ~5 chars/word

    print(f"Monthly for {calls_per_day} calls/day:")
    print(f"  ASR:   \${asr:.2f}")
    print(f"  LLM:   \${llm:.2f}")
    print(f"  TTS:   \${tts:.2f}")
    print(f"  TOTAL: \${asr+llm+tts:.2f}")

estimate_monthly_cost(calls_per_day=1000, avg_duration_seconds=120)`
        },
        {
          id: "system-design-walkthroughs",
          title: "System Design Walkthroughs",
          tag: "must know",
          summary: "Three complete system design answers — semantic search, recommendation, and content moderation. Practise talking through each in 30 minutes.",
          concepts: [
            {
              title: "Design: semantic search over a large document corpus",
              body: `Semantic search returns results based on meaning, not keyword overlap. The interviewer is testing whether you understand the full pipeline, where it breaks, and how to scale it.

Step 1 — Clarify requirements (do this out loud):
Functional: full-text + semantic search over documents, return ranked results, support filters (date, category, author).
Non-functional: latency < 200ms P99, 10M documents, 1000 QPS, freshness < 5 minutes for new documents.

Step 2 — High-level architecture:
Ingestion pipeline: document arrives → chunk → embed → write to vector DB + inverted index.
Query pipeline: query → embed → hybrid search (vector + BM25) → rerank → return top-k.

Step 3 — Deep dives:

Chunking: 512-token chunks with 64-token overlap. Paragraph-aware splitting — never cut mid-sentence. Store parent document ID with each chunk for attribution.

Embedding model choice: sentence-transformers/all-MiniLM-L6-v2 for low latency (80ms, 384-dim). text-embedding-3-large for quality (but 3x slower, 8x larger index). For 10M docs at 512 tokens average, at 384 dims float32: 10M × 384 × 4 bytes = 15GB. Fits on one machine; for larger corpora, shard by namespace/category.

Vector DB: Qdrant or Weaviate for self-hosted. Pinecone for managed. Use HNSW indexing — M=16, ef_construction=128 as starting point. Filter via payload filters (don't pre-filter in application code).

Freshness: Kafka topic for new documents → embedding worker fleet → upsert into vector DB. Vector DB upserts are near-real-time. For deletes, use soft-delete flag in metadata; hard-delete async.

Step 4 — Trade-offs:
Exact vs approximate: HNSW is approximate — you can miss some relevant results. For legal/compliance search where recall must be 100%, use exact search with FAISS FlatIndex and accept higher latency.
Index size vs recall: higher M and ef_construction = better recall, larger memory. Profile on your data.
Embedding freshness: if documents are updated frequently, you need to re-embed on change — track content hash, re-embed only when hash changes.`,
              code: `# Semantic search system — key components

import hashlib
import time
from dataclasses import dataclass

@dataclass
class Document:
    id: str
    content: str
    metadata: dict
    content_hash: str = ""

    def __post_init__(self):
        self.content_hash = hashlib.md5(self.content.encode()).hexdigest()

class ChunkingService:
    def __init__(self, chunk_size=512, overlap=64):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, doc: Document) -> list:
        words = doc.content.split()
        chunks = []
        i = 0
        while i < len(words):
            chunk_words = words[i:i + self.chunk_size]
            chunks.append({
                "doc_id": doc.id,
                "chunk_id": f"{doc.id}_{len(chunks)}",
                "text": " ".join(chunk_words),
                "metadata": doc.metadata,
                "position": i,
            })
            i += self.chunk_size - self.overlap  # Slide with overlap
        return chunks

class EmbeddingService:
    def __init__(self, model="minilm"):
        self.dim = {"minilm": 384, "ada-002": 1536, "text-3-large": 3072}[model]
        self.latency_ms = {"minilm": 10, "ada-002": 50, "text-3-large": 80}[model]

    def embed(self, texts: list) -> list:
        """Returns list of vectors (stubbed as random-ish values)"""
        import random
        time.sleep(self.latency_ms / 1000 * len(texts) / 32)  # Batch of 32
        return [[random.gauss(0, 1) for _ in range(self.dim)] for _ in texts]

class SearchPipeline:
    def __init__(self):
        self.chunker = ChunkingService()
        self.embedder = EmbeddingService("minilm")
        self.index = {}  # doc_id → (vector, metadata)

    def ingest(self, doc: Document):
        chunks = self.chunker.chunk(doc)
        texts = [c["text"] for c in chunks]
        vectors = self.embedder.embed(texts)
        for chunk, vec in zip(chunks, vectors):
            self.index[chunk["chunk_id"]] = (vec, chunk)
        print(f"Indexed doc {doc.id}: {len(chunks)} chunks")

    def search(self, query: str, k=5, filters=None) -> list:
        start = time.time()
        query_vec = self.embedder.embed([query])[0]

        # Cosine similarity (stub: dot product on unit vectors)
        def cosine_sim(a, b):
            dot = sum(x*y for x,y in zip(a,b))
            norm_a = sum(x**2 for x in a) ** 0.5
            norm_b = sum(x**2 for x in b) ** 0.5
            return dot / (norm_a * norm_b + 1e-9)

        scores = []
        for chunk_id, (vec, chunk) in self.index.items():
            if filters:
                if not all(chunk["metadata"].get(k) == v for k, v in filters.items()):
                    continue
            scores.append((cosine_sim(query_vec, vec), chunk_id, chunk))

        scores.sort(reverse=True)
        latency = (time.time() - start) * 1000
        print(f"Search took {latency:.0f}ms, {len(self.index)} chunks searched")
        return scores[:k]

# Test
pipeline = SearchPipeline()
docs = [
    Document("d1", "Python is a high-level programming language known for readability. " * 10, {"category": "tech"}),
    Document("d2", "Machine learning models learn patterns from training data. " * 10, {"category": "ai"}),
    Document("d3", "The refund policy allows returns within 30 days of purchase. " * 10, {"category": "policy"}),
]
for doc in docs:
    pipeline.ingest(doc)

results = pipeline.search("how to write code in python", k=3)
print("\\nTop results:")
for score, cid, chunk in results:
    print(f"  {score:.3f} | {chunk['text'][:60]}...")`
            },
            {
              title: "Design: recommendation system for a content platform",
              body: `Recommendation systems are asked in almost every senior AI/ML engineering interview. The key is knowing the stages and trade-offs, not memorising algorithms.

The two-stage funnel (industry standard):

Stage 1 — Retrieval (Candidate Generation): from millions of items, retrieve hundreds of candidates quickly. Goal: recall. Methods:
— Collaborative filtering: users who liked what you liked also liked X. Matrix factorisation (ALS, SVD) or two-tower neural model.
— Content-based: items similar to what you've engaged with (embedding similarity).
— Trending/editorial: globally popular items (fallback for new users).
Use multiple retrieval sources and merge. This stage must run in < 50ms.

Stage 2 — Ranking: score each candidate with a rich feature set and a more expensive model. Goal: precision. Features:
— User features: demographics, history, session context (device, time of day)
— Item features: category, age, engagement stats
— Context features: position in feed, query (if search)
— Cross features: has user engaged with this creator before?
Typical model: gradient boosted trees (XGBoost/LightGBM) or a small neural net with embeddings. Optimise for click-through rate, watch time, or explicit rating depending on your objective.

Cold start problem: new users have no history. Solutions: ask onboarding questions (preference quiz), use demographic features, default to trending in their region, use implicit signals quickly (what they browse in the first session).

The objective gap: you optimise for CTR (clicks) but you want engagement or satisfaction. Users click clickbait but hate it. Add diversity, serendipity, and explicit negative signals (thumbs down). Don't blindly maximise CTR — it leads to filter bubbles and user churn.

Feedback loop: your model trained on past recommendations causes users to see and click only certain content → future training data is biased toward that content → model reinforces the bias. Mitigate with exploration (epsilon-greedy or Thompson sampling), counterfactual evaluation, and logging impression data even for non-clicked items.`,
              code: `# Two-tower retrieval model — simplified

import math
import random

class TwoTowerModel:
    """
    Two separate towers (neural nets) encode users and items
    into the same embedding space. Similarity = dot product.
    Training: contrastive loss — push user closer to items they engaged with.
    Inference: embed user → nearest-neighbour search in item embedding space.
    """
    def __init__(self, embedding_dim=64):
        self.dim = embedding_dim
        # Simulated learned embeddings (real: trained with gradient descent)
        self.user_embeddings = {}
        self.item_embeddings = {}

    def get_user_embedding(self, user_id: str, user_features: dict) -> list:
        if user_id not in self.user_embeddings:
            # New user: use feature-based initialisation
            seed = hash(str(user_features)) % 1000
            random.seed(seed)
            self.user_embeddings[user_id] = [random.gauss(0, 1) for _ in range(self.dim)]
        return self.user_embeddings[user_id]

    def get_item_embedding(self, item_id: str) -> list:
        if item_id not in self.item_embeddings:
            random.seed(hash(item_id) % 1000)
            self.item_embeddings[item_id] = [random.gauss(0, 1) for _ in range(self.dim)]
        return self.item_embeddings[item_id]

    def retrieve(self, user_id: str, user_features: dict, all_items: list, k=10) -> list:
        """Stage 1: retrieve top-k candidates from item pool"""
        user_emb = self.get_user_embedding(user_id, user_features)

        def dot(a, b):
            return sum(x*y for x,y in zip(a,b))

        scores = [(dot(user_emb, self.get_item_embedding(item)), item)
                  for item in all_items]
        scores.sort(reverse=True)
        return [item for _, item in scores[:k]]

class RankingModel:
    """Stage 2: score candidates with rich features"""
    def score(self, user_features: dict, item_features: dict, context: dict) -> float:
        # Simplified scoring (real: XGBoost or neural net)
        score = 0.5
        # Recency bonus
        age_days = item_features.get("age_days", 30)
        score += max(0, (30 - age_days) / 30) * 0.2
        # Engagement rate
        score += item_features.get("ctr", 0.05) * 0.3
        # User affinity for category
        preferred = user_features.get("preferred_categories", [])
        if item_features.get("category") in preferred:
            score += 0.2
        return min(1.0, score)

# Full recommendation pipeline
def recommend(user_id, user_features, item_catalog, k_retrieve=50, k_final=10):
    tower = TwoTowerModel()
    ranker = RankingModel()

    # Stage 1: retrieve candidates
    candidates = tower.retrieve(user_id, user_features, list(item_catalog.keys()), k=k_retrieve)
    print(f"Stage 1: retrieved {len(candidates)} candidates from {len(item_catalog)} items")

    # Stage 2: rank
    scored = [(ranker.score(user_features, item_catalog[item], {}), item)
              for item in candidates]
    scored.sort(reverse=True)

    final = [item for _, item in scored[:k_final]]
    print(f"Stage 2: ranked → top {k_final}: {final[:5]}...")
    return final

# Test
catalog = {f"item_{i}": {"age_days": i % 30, "ctr": 0.05 + (i%10)*0.01,
                          "category": ["tech","sports","news"][i%3]} for i in range(200)}
user = {"preferred_categories": ["tech"], "history": ["item_1", "item_5"]}
recommend("user_42", user, catalog)`
            },
            {
              title: "Design: content moderation pipeline",
              body: `Content moderation is a high-stakes system design problem — the cost of false negatives (bad content shown) and false positives (good content removed) are both real. Every design decision is a trade-off between these two error types.

The layered moderation pipeline:

Layer 1 — Blocklist/regex (sync, < 1ms): exact matches against known slurs, spam patterns, URLs to blocked domains. Fast, zero false negatives for known patterns, but useless for novel content.

Layer 2 — ML classifier (sync, 10-50ms): fine-tuned model (BERT/DistilBERT or a dedicated model like Perspective API) scores content on multiple axes: hate speech, spam, sexual content, violence, self-harm. Returns confidence scores, not binary flags.

Layer 3 — LLM review (async, 500ms-2s): for borderline cases (confidence 0.4-0.8), route to an LLM for nuanced judgement with context. The LLM can reason about sarcasm, satire, quotation, and context that a classifier misses.

Layer 4 — Human review: for appeals, for content above a threshold that requires human judgement, for low-confidence LLM outputs. Track inter-rater agreement — if two reviewers disagree frequently, your guidelines are unclear.

Decision architecture:
— Auto-remove: classifier confidence > 0.95 on severe violations (CSAM, explicit violence)
— Auto-allow: confidence < 0.1 on all categories
— Shadow mode: action taken but reversible (hide from feed, keep in DB) while LLM/human reviews
— Appeal queue: users can dispute auto-removals; human reviews within 24h

Precision vs recall trade-off by content type: for child safety content, maximise recall (remove everything above low threshold, accept false positives). For hate speech, balance precision and recall — over-removal silences legitimate speech. The threshold is a policy decision, not an ML decision.

Scale considerations: at 100M posts/day, even a 0.1% false positive rate = 100,000 wrongly removed posts/day. Human review capacity is finite (~500 reviews/reviewer/day). Design to minimise the volume that reaches human review while maintaining quality.`,
              code: `# Content moderation pipeline with layered decision logic

from dataclasses import dataclass
from enum import Enum

class Decision(Enum):
    ALLOW = "allow"
    REMOVE = "remove"
    SHADOW = "shadow"       # Hidden but not deleted
    HUMAN_REVIEW = "human_review"

class ViolationType(Enum):
    HATE_SPEECH = "hate_speech"
    SPAM = "spam"
    VIOLENCE = "violence"
    SEXUAL = "sexual"
    SAFE = "safe"

@dataclass
class ModerationResult:
    content_id: str
    decision: Decision
    violation_type: ViolationType
    confidence: float
    layer: str
    reasoning: str = ""

# Layer 1: blocklist
BLOCKLIST = {"badword1", "slur2", "spam-url.com"}

def blocklist_check(content: str, content_id: str):
    for term in BLOCKLIST:
        if term in content.lower():
            return ModerationResult(content_id, Decision.REMOVE,
                                     ViolationType.HATE_SPEECH, 1.0, "blocklist",
                                     f"Exact match: '{term}'")
    return None

# Layer 2: ML classifier (stubbed)
def ml_classify(content: str, content_id: str) -> ModerationResult:
    """Returns confidence scores per violation type"""
    # Stub: real impl uses a fine-tuned BERT / Perspective API
    scores = {
        ViolationType.HATE_SPEECH: 0.05,
        ViolationType.SPAM: 0.10,
        ViolationType.VIOLENCE: 0.03,
        ViolationType.SEXUAL: 0.02,
    }
    # Simulate some content being flagged
    if "hate" in content.lower():
        scores[ViolationType.HATE_SPEECH] = 0.87
    if "buy now click here" in content.lower():
        scores[ViolationType.SPAM] = 0.95

    max_violation = max(scores, key=scores.get)
    max_score = scores[max_violation]
    return ModerationResult(content_id, Decision.ALLOW, max_violation, max_score, "ml_classifier")

# Layer 3: LLM review for borderline cases (stubbed)
def llm_review(content: str, content_id: str, initial_result: ModerationResult):
    """More nuanced review — handles satire, context, quotation"""
    # Stub: real impl calls GPT-4 / Claude with a detailed moderation prompt
    borderline_prompt = f"""Review this content for policy violations.
Consider context, satire, quotation, and intent.
Content: {content}
Initial classifier: {initial_result.violation_type.value} at {initial_result.confidence:.0%}
Return: REMOVE (clear violation), ALLOW (not a violation), or ESCALATE (unclear)"""

    # Simulated LLM response
    llm_decision = "ALLOW"  # Stub
    final_decision = {
        "REMOVE": Decision.SHADOW,   # LLM says remove → shadow (human can confirm)
        "ALLOW": Decision.ALLOW,
        "ESCALATE": Decision.HUMAN_REVIEW
    }[llm_decision]
    return ModerationResult(content_id, final_decision, initial_result.violation_type,
                             initial_result.confidence, "llm_review", f"LLM: {llm_decision}")

def moderate(content_id: str, content: str) -> ModerationResult:
    """Full moderation pipeline"""
    # Layer 1: blocklist
    result = blocklist_check(content, content_id)
    if result:
        return result

    # Layer 2: ML classifier
    result = ml_classify(content, content_id)

    # Decision thresholds
    if result.confidence > 0.90:
        result.decision = Decision.REMOVE
        return result
    elif result.confidence > 0.40:
        # Borderline: escalate to LLM
        return llm_review(content, content_id, result)
    else:
        result.decision = Decision.ALLOW
        return result

# Test
test_posts = [
    ("p1", "Just had a great lunch today!"),
    ("p2", "Buy now click here limited offer!!!"),
    ("p3", "I hate Mondays but love Fridays"),  # Low hate score — common phrase
    ("p4", "badword1 in this post"),             # Blocklist hit
]

for pid, text in test_posts:
    result = moderate(pid, text)
    print(f"{pid}: {result.decision.value:12} | {result.layer:14} | "
          f"{result.violation_type.value:12} @ {result.confidence:.0%}")`
            }
          ],
          quiz: [
            {
              q: "In a two-stage recommendation system, what is the primary goal of each stage?",
              options: ["Stage 1: accuracy; Stage 2: speed", "Stage 1: recall (retrieve all potentially relevant items quickly); Stage 2: precision (rank the best candidates accurately)", "Both stages optimise for the same metric", "Stage 1: ranking; Stage 2: retrieval"],
              answer: 1,
              explain: "Stage 1 (retrieval) must run over millions of items in < 50ms — it prioritises recall so you don't miss good candidates, using fast approximate methods. Stage 2 (ranking) scores only hundreds of candidates with expensive features and a richer model — it prioritises precision to put the best items first."
            },
            {
              q: "In semantic search, why use hybrid search (vector + BM25) rather than pure vector search?",
              options: ["BM25 is always more accurate", "Vector search can miss exact-match terms (IDs, names, rare words) that have no semantic neighbours; BM25 fills this gap", "Hybrid search is always faster", "Vector DBs don't support filtering"],
              answer: 1,
              explain: "Embedding models map meaning to vectors — a product ID like 'SKU-44821' has no meaningful embedding neighbourhood. BM25 finds exact keyword matches that vector search misses. Hybrid search (RRF-merged) provides high recall for both semantic and keyword queries."
            },
            {
              q: "Why is content moderation not simply 'remove everything above a confidence threshold'?",
              options: ["It's too expensive", "False positives (wrongly removing legitimate content) silence real speech at scale — at 100M posts/day, a 0.1% FPR = 100k wrongly removed posts", "ML classifiers can't set thresholds", "Thresholds only work for spam"],
              answer: 1,
              explain: "At platform scale, even excellent precision still produces massive false positive counts in absolute terms. Over-moderation has real costs: user trust, legal challenges, and silencing marginalised communities. The threshold is a policy decision balancing harm reduction against false positives — set differently per violation type."
            }
          ],
          starter: `# System design practice: back-of-envelope estimation
# These numbers come up in every system design interview

def estimate_semantic_search(docs_millions, qps, avg_doc_tokens=500):
    """Estimate infrastructure for a semantic search system"""
    print(f"=== Semantic Search: {docs_millions}M docs, {qps} QPS ===")

    # Storage: embeddings (384-dim float32 = 1536 bytes per chunk)
    chunks_per_doc = avg_doc_tokens / 256  # 256-token chunks
    total_chunks = docs_millions * 1e6 * chunks_per_doc
    embedding_gb = total_chunks * 384 * 4 / 1e9  # 384-dim float32
    print(f"Embedding storage: {embedding_gb:.0f} GB")
    print(f"A100 (80GB) instances needed: {math.ceil(embedding_gb / 60)}")  # 75% util

    # Ingestion throughput
    new_docs_per_day = docs_millions * 1e6 * 0.01  # Assume 1% churn/day
    embed_calls_per_day = new_docs_per_day * chunks_per_doc
    print(f"Embedding calls/day for ingestion: {embed_calls_per_day:,.0f}")

    # Query throughput
    daily_queries = qps * 86400
    print(f"Queries/day: {daily_queries:,.0f}")
    print()

def estimate_recommendation(users_millions, dau_fraction, items_millions):
    """Estimate infrastructure for a recommendation system"""
    import math
    dau = users_millions * 1e6 * dau_fraction
    feed_loads_per_dau = 5  # Average feed refreshes per day
    recs_per_second = dau * feed_loads_per_dau / 86400
    print(f"=== Recommendation: {users_millions}M users, {items_millions}M items ===")
    print(f"DAU: {dau/1e6:.1f}M")
    print(f"Recommendation QPS: {recs_per_second:.0f}")
    candidate_pool_per_request = 500
    ranking_features_per_candidate = 50
    print(f"Features computed/sec: {recs_per_second * candidate_pool_per_request * ranking_features_per_candidate:,.0f}")
    print()

import math
estimate_semantic_search(docs_millions=10, qps=1000)
estimate_recommendation(users_millions=50, dau_fraction=0.4, items_millions=5)
`
        }
      ]
    }
  ]
};
