# Securely Voting Online

A large criticism of online voting systems is their inability to provide a number of requirements that we take for granted.



* Eligable voters only
* Privacy
    - From votes and during casting of vote
    - From Flux (the administrator)
    - Eavesdropping over the comms channel
* Verification that my vote was correct
* Evidence every vote is properly counted

## Eligibility

Cryptographic Identities are 'empowered' by Flux as an administrative body. 
Think of it this way: every possible identity has 0 votes, but this number can be changed by the authority.
When Flux validates an identity we empower it appropriately (IE 1 vote for a person, possibly more for other parties or parliamentarians who opt in).
When an identity issues an instruction, the auditing software looks up how many votes that identity is entitled to and if the instruction is valid the count is altered.

This is a non-fatal weak link, though it's unlikely this problem can be solved because at some point a central authority needs to do things like recording births and so on.

An attack vector, in this case, would be for someone to compromise the central authorities identity. 
This has similar security requirements to securing a certificate authority.
By inspection we know this to be possible to secure and to set up in such a way to prevent any rogue empowerments.
(IE recovery identity + network alerts + constant monitoring)

## Privacy

### Casting your vote

Without enforcing physical parameters (IE come to this voting booth) the 'over the shoulder' problem remains a problem for the user.
There are maybe some 