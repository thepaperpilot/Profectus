import {
    Conversion,
    ConversionOptions,
    createIndependentConversion,
    createLinearScaling
} from "features/conversion";
import { createResource, Resource } from "features/resources/resource";
import Decimal, { DecimalSource } from "util/bignum";
import { it, beforeEach, describe, expect } from "@jest/globals";
/**
 * In this test suite `bugs` are converted to `headaches` using the default scalingFunction.
 * The example values from the documentation are tested on `currentGain()`, `currentAt()` and `nextAt()`
 */
describe("LinearScalingFunction", () => {
    let bugResource: Resource;
    let headacheResource: Resource;
    let bugsToHeadachesConversion: Conversion<ConversionOptions>;

    beforeEach(() => {
        bugResource = createResource<DecimalSource>(0, "Bugs");
        headacheResource = createResource<DecimalSource>(0, "Headaches");
        bugsToHeadachesConversion = createIndependentConversion(() => {
            return {
                baseResource: bugResource,
                gainResource: headacheResource,
                scaling: createLinearScaling(10, 0.5),
                buyMax: true
            };
        });
    });

    it.each([
        [10, 1],
        [12, 2],
        [20, 6]
    ])(
        "Is documentation example correct for currentGain?",
        async (bugCount: number, expectedGain: number) => {
            // Arrange
            bugResource.value = Decimal.add(bugCount, bugResource.value);

            // Act
            const currentGain = bugsToHeadachesConversion.currentGain.value;

            // Assert
            expect(currentGain).toEqual(new Decimal(expectedGain));
        }
    );

    it.each([
        [11, 10],
        [17, 12],
        [21, 20]
    ])(
        "Is documentation example correct for currentAt?",
        async (bugCount: number, expectedAt: number) => {
            // Arrange
            bugResource.value = Decimal.add(bugCount, bugResource.value);

            // Act
            const currentAt = bugsToHeadachesConversion.currentAt.value;

            // Assert
            expect(currentAt).toEqual(new Decimal(expectedAt));
        }
    );

    it.each([
        [-10, 10],
        [9, 10],
        [10, 12],
        [11, 12],
        [14, 20]
    ])(
        "Is documentation example correct for nextAt?",
        async (bugCount: number, expectedNextAt: number) => {
            // Arrange
            bugResource.value = Decimal.add(bugCount, bugResource.value);

            // Act
            const nextAT = bugsToHeadachesConversion.nextAt.value;

            // Assert
            expect(nextAT).toEqual(new Decimal(expectedNextAt));
        }
    );
});
