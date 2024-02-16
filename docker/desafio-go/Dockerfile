FROM golang:latest AS gobuild
WORKDIR $GOPATH/src
COPY ./fc-rocks.go .
RUN go build fc-rocks.go 

#FROM alpine:latest
FROM scratch
COPY --from=gobuild /go/src/fc-rocks .
CMD ["./fc-rocks"]