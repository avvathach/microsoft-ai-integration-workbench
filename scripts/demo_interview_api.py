#!/usr/bin/env python3
"""Black-box contract check for the HR1 synthetic interview API."""

import argparse
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DECISION_BOUNDARY = "Recommendation only; authorized human decision required."
CASE_IDS = ("SYN-ID-001", "SYN-TXN-002", "SYN-CRS-003")


def request_json(url: str, method: str = "GET", payload: dict | None = None) -> dict:
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=body,
        method=method,
        headers={"Content-Type": "application/json", "Origin": "http://localhost:5173"},
    )
    with urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def validate_contract(result: dict, case_id: str) -> None:
    analysis = result.get("analysis", {})
    assert result.get("caseId") == case_id, "response case ID changed"
    assert result.get("mode") in {"guided-fixture", "live-model"}, "unexpected execution mode"
    assert analysis.get("recommendation") in {"accept_match", "reject_match", "escalate"}, "invalid recommendation"
    assert isinstance(analysis.get("confidence"), int), "confidence must be an integer"
    assert analysis.get("humanReviewRequired") is True, "human review boundary was lost"
    assert analysis.get("decisionBoundary") == DECISION_BOUNDARY, "decision boundary changed"
    assert all(item.get("writeAccess") is False for item in result.get("trace", [])), "a tool reported write access"


def main() -> int:
    parser = argparse.ArgumentParser(description="Exercise and validate the HR1 synthetic interview API")
    parser.add_argument("--base-url", default="http://localhost:5173/api/interview")
    parser.add_argument("--case", choices=CASE_IDS, default="SYN-TXN-002")
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")

    try:
        status = request_json(f"{base_url}/status")
        result = request_json(f"{base_url}/analyze", "POST", {"caseId": args.case})
        validate_contract(result, args.case)
    except (AssertionError, HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        print(f"Contract check failed: {error}", file=sys.stderr)
        return 1

    safe_summary = {
        "status": status.get("status"),
        "mode": result.get("mode"),
        "caseId": result.get("caseId"),
        "recommendation": result["analysis"]["recommendation"],
        "humanReviewRequired": result["analysis"]["humanReviewRequired"],
        "readOnlyTools": [item.get("tool") for item in result.get("trace", [])],
        "contract": "PASS",
    }
    print(json.dumps(safe_summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
