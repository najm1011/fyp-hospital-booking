package com.hospitalapp.backend.dto.hospital;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NhsOrganisation {

    @JsonProperty("Name")
    private String name;

    @JsonProperty("OrgId")
    private String orgId;

    @JsonProperty("Status")
    private String status;

    @JsonProperty("PostCode")
    private String postCode;

    @JsonProperty("LastChangeDate")
    private String lastChangeDate;

    @JsonProperty("PrimaryRoleId")
    private String primaryRoleId;

    @JsonProperty("PrimaryRoleDescription")
    private String primaryRoleDescription;

    @JsonProperty("OrgLink")
    private String orgLink;

    public NhsOrganisation() {
    }

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getLastChangeDate() {
        return lastChangeDate;
    }

    public void setLastChangeDate(String lastChangeDate) {
        this.lastChangeDate = lastChangeDate;
    }

    public String getPrimaryRoleId() {
        return primaryRoleId;
    }

    public void setPrimaryRoleId(String primaryRoleId) {
        this.primaryRoleId = primaryRoleId;
    }

    public String getPrimaryRoleDescription() {
        return primaryRoleDescription;
    }

    public void setPrimaryRoleDescription(String primaryRoleDescription) {
        this.primaryRoleDescription = primaryRoleDescription;
    }

    public String getOrgLink() {
        return orgLink;
    }

    public void setOrgLink(String orgLink) {
        this.orgLink = orgLink;
    }
}
